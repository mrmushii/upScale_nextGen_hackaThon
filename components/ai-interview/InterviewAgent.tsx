"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapiClient";
import { interviewerConfig } from "@/constants/aiInterview";
import clsx from "clsx";
import toast from "react-hot-toast";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface Props {
  userName: string;
  userId: string;
  type: "generate" | "interview";
  interviewId?: string;
  questions?: string[];
}

export default function InterviewAgent({
  userName,
  userId,
  type,
  interviewId,
  questions,
}: Props) {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const latestMessage = messages.at(-1)?.content;

  useEffect(() => {
    if (!vapi) {
      console.warn("Vapi client not initialised. Missing NEXT_PUBLIC_VAPI_WEB_TOKEN.");
      return;
    }

    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => {
      console.error("Vapi error", error);
      toast.error("The interview assistant encountered an issue.");
      setCallStatus(CallStatus.FINISHED);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    async function submitFeedback() {
      if (
        callStatus === CallStatus.FINISHED &&
        type === "interview" &&
        interviewId
      ) {
        try {
          const response = await fetch(
            `/api/ai-interviews/${interviewId}/feedback`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ transcript: messages }),
            }
          );

          if (!response.ok) {
            throw new Error(await response.text());
          }

          toast.success("Feedback generated successfully.");
          router.push(`/dashboard/interviews/${interviewId}/feedback`);
        } catch (error) {
          console.error("Feedback generation failed", error);
          toast.error("We couldn't generate feedback. Please try again.");
          router.push("/dashboard/interviews");
        }
      }

      if (callStatus === CallStatus.FINISHED && type === "generate") {
        router.push("/dashboard/interviews");
      }
    }

    submitFeedback();
  }, [callStatus, type, interviewId, messages, router]);

  const formattedQuestions = useMemo(() => {
    if (!questions?.length) return "";
    return questions.map((question) => `- ${question}`).join("\n");
  }, [questions]);

  const handleCall = async () => {
    if (!vapi) {
      toast.error("Voice assistant is not configured.");
      return;
    }

    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    if (!workflowId) {
      toast.error("Missing interview workflow configuration.");
      return;
    }

    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(workflowId, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
      return;
    }

    await vapi.start(interviewerConfig, {
      variableValues: {
        questions: formattedQuestions,
      },
    });
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi?.stop();
  };

  const isCallActive = callStatus === CallStatus.ACTIVE;
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <div className="space-y-8">
      <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col items-center gap-4 rounded-3xl bg-white p-6 shadow-lg md:flex-row md:gap-6">
          <div className="relative">
            <Image
              src="/ai-avatar.png"
              alt="AI interviewer"
              width={72}
              height={72}
              className="size-20 rounded-full border-4 border-slate-100 object-cover shadow-md"
            />
            {isSpeaking && (
              <span className="absolute inset-0 animate-ping rounded-full border-2 border-primary-400" />
            )}
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              AI Interviewer
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              Ready when you are, {userName.split(" ")[0] || "candidate"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Speak naturally. The assistant will guide you through the interview
              and provide personalised feedback afterwards.
            </p>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Live Transcript
          </h3>
          <p
            key={latestMessage}
            className={clsx(
              "mt-3 text-base text-slate-800",
              "transition-opacity duration-500"
            )}
          >
            {latestMessage}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        {!isCallActive ? (
          <button
            onClick={handleCall}
            className="relative inline-flex h-14 min-w-[160px] items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-coral-500 px-10 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
          >
            <span
              className={clsx(
                "absolute inset-0 rounded-full border-2 border-white/30",
                callStatus === CallStatus.CONNECTING ? "animate-ping" : "hidden"
              )}
            />
            {isCallInactiveOrFinished ? "Start Interview" : "Connecting..."}
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="inline-flex h-14 min-w-[160px] items-center justify-center rounded-full bg-slate-800 px-10 text-base font-semibold text-white shadow-lg transition hover:bg-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
          >
            End Interview
          </button>
        )}
      </div>
    </div>
  );
}



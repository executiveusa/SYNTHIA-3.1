"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

interface AvatarContextType {
  isReacting: boolean;
  triggerNoReaction: () => void;
  isApproving: boolean;
  triggerYesReaction: () => void;
  showInviteModal: boolean;
  openInviteModal: () => void;
  closeInviteModal: () => void;
  currentTrack: string;
  setCurrentTrack: (path: string) => void;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [isReacting, setIsReacting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(
    "/audio/birds39-forest-20772.mp3"
  );
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const approveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerNoReaction = useCallback(() => {
    setIsReacting(true);
    if (reactionTimer.current) clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => {
      setIsReacting(false);
    }, 1600);
  }, []);

  // "Yes" gesture: index finger dips 3× (forward pitch) over 1800ms
  const triggerYesReaction = useCallback(() => {
    setIsApproving(true);
    if (approveTimer.current) clearTimeout(approveTimer.current);
    approveTimer.current = setTimeout(() => {
      setIsApproving(false);
    }, 1800);
  }, []);

  const openInviteModal = useCallback(() => setShowInviteModal(true), []);
  const closeInviteModal = useCallback(() => setShowInviteModal(false), []);

  return (
    <AvatarContext.Provider
      value={{
        isReacting,
        triggerNoReaction,
        isApproving,
        triggerYesReaction,
        showInviteModal,
        openInviteModal,
        closeInviteModal,
        currentTrack,
        setCurrentTrack,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatarContext() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatarContext must be used inside AvatarProvider");
  return ctx;
}

export default AvatarContext;

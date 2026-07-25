"use client";

import { useRef } from "react";
import { apiRequest } from "../../lib/api";

interface ProfileForm {
  displayName: string;
  bio: string;
  country: string;
  avatarUrl: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  profileForm: ProfileForm;
  onProfileFormChange: (form: ProfileForm) => void;
}

export function ProfileModal({
  isOpen,
  onClose,
  onSave,
  profileForm,
  onProfileFormChange,
}: ProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await apiRequest<{ url: string }>("/upload/image", {
        method: "POST",
        body: formData,
        headers: {},
      });
      onProfileFormChange({ ...profileForm, avatarUrl: data.url });
    } catch (err) {
      console.error("Avatar upload failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm">
      <div className="bg-white border border-stone-200 rounded-3xl p-8 max-w-sm w-full shadow-xl space-y-5 mx-4 animate-in fade-in zoom-in duration-150">
        <div className="space-y-1.5">
          <h3 className="font-rethink font-bold text-lg text-stone-900">Complete your profile</h3>
          <p className="text-xs text-stone-500 font-medium">
            Help brands know you by filling out your creator profile.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-20 h-20 rounded-full bg-stone-100 border-2 border-dashed border-stone-300 hover:border-stone-400 flex items-center justify-center overflow-hidden transition-colors group"
          >
            {profileForm.avatarUrl ? (
              <img src={profileForm.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-stone-300 group-hover:text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1">Display Name</label>
            <input
              type="text"
              value={profileForm.displayName}
              onChange={(e) => onProfileFormChange({ ...profileForm, displayName: e.target.value })}
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium text-stone-950 focus:outline-none focus:border-stone-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1">Country</label>
            <input
              type="text"
              value={profileForm.country}
              onChange={(e) => onProfileFormChange({ ...profileForm, country: e.target.value })}
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium text-stone-950 focus:outline-none focus:border-stone-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1">Bio</label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => onProfileFormChange({ ...profileForm, bio: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-medium text-stone-950 focus:outline-none focus:border-stone-300 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-full font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-2.5 bg-stone-950 hover:bg-stone-800 text-white rounded-full font-semibold text-xs transition-colors shadow-sm"
          >
            Finish profile
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

interface SocialConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  platform: string;
  onPlatformChange: (platform: string) => void;
  handle: string;
  onHandleChange: (handle: string) => void;
}

export function SocialConnectModal({
  isOpen,
  onClose,
  onConnect,
  platform,
  onPlatformChange,
  handle,
  onHandleChange,
}: SocialConnectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm">
      <div className="bg-white border border-stone-200 rounded-3xl p-8 max-w-sm w-full space-y-6 mx-4 animate-in fade-in zoom-in duration-150">
        <div className="space-y-1.5">
          <h3 className="font-rethink font-medium text-lg text-stone-900">Connect a social account</h3>
          <p className="text-xs text-stone-500 font-medium">
            Select a platform and enter your handle to link your account.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {["TikTok", "Instagram", "YouTube"].map((p) => (
                <button
                  key={p}
                  onClick={() => onPlatformChange(p)}
                  className={`py-2 text-xs font-medium rounded-full border ${
                    platform === p
                      ? "bg-stone-950 text-white border-stone-950"
                      : "bg-white text-stone-600 border-stone-200"
                  } font-rethink`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Social Handle</label>
            <input
              type="text"
              placeholder="@yourhandle"
              value={handle}
              onChange={(e) => onHandleChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium text-stone-950 placeholder-stone-400 focus:outline-none focus:border-stone-300 font-rethink"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-stone-50 border border-stone-200 text-stone-600 rounded-full font-medium text-xs font-rethink"
          >
            Cancel
          </button>
          <button
            onClick={onConnect}
            className="flex-1 py-2.5 bg-stone-950 text-white rounded-full font-semibold text-xs font-rethink"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}

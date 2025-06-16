// src/components/ToastNotification.jsx
import React, { useState, useEffect, createContext, useContext } from "react";
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";

// 토스트 컨텍스트
const ToastContext = createContext();

// 토스트 타입별 설정
const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500",
    textColor: "text-white",
    duration: 3000,
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-500",
    textColor: "text-white",
    duration: 5000,
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-500",
    textColor: "text-white",
    duration: 4000,
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500",
    textColor: "text-white",
    duration: 3000,
  },
};

// 개별 토스트 컴포넌트
const Toast = ({ toast, onRemove }) => {
  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, config.duration);

    return () => clearTimeout(timer);
  }, [toast.id, config.duration, onRemove]);

  return (
    <div
      className="toast-item"
      style={{
        background:
          toast.type === "success"
            ? "#10b981"
            : toast.type === "error"
            ? "#ef4444"
            : toast.type === "warning"
            ? "#f59e0b"
            : "#3b82f6",
        color: "white",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "400px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Icon size={16} />
        <div>
          {toast.title && (
            <div
              style={{
                fontWeight: "600",
                fontSize: "14px",
                marginBottom: "2px",
              }}
            >
              {toast.title}
            </div>
          )}
          <div style={{ fontSize: "13px", opacity: 0.9 }}>{toast.message}</div>
        </div>
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          opacity: 0.7,
          padding: "4px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          marginLeft: "12px",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

// 토스트 컨테이너
const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// 토스트 프로바이더
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, title = null) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, message, title };

    setToasts((prev) => [...prev, newToast]);

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // 편의 메서드들
  const toast = {
    success: (message, title) => addToast("success", message, title),
    error: (message, title) => addToast("error", message, title),
    warning: (message, title) => addToast("warning", message, title),
    info: (message, title) => addToast("info", message, title),
    clear: clearAllToasts,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// 토스트 훅
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

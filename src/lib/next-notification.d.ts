/// <reference types="next" />

// To add properties to the NotificationOptions interface
declare global {
  interface NotificationOptions {
    actions?: { action: string; title: string; }[];
  }
}

export {};

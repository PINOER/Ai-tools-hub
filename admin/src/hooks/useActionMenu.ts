import { REVIEWS_TABS, TOOL_TABS } from "@/lib/contants";
import type { ScreenType } from "@/types";
import { ToolsStatus } from "@/types/tools";

// Action Keys
export const ACTION_KEYS = {
  VIEW: "view",
  EDIT: "edit",
  DELETE: "delete",
  DELETE_MULTIPLE: "delete-multiple",

  // Tools
  APPROVE_SUBMISSION: "approve-submission",
  REJECT_SUBMISSION: "reject-submission",
  APPROVE_CLAIM: "approve-claim",
  APPROVE_SUBMISSIONS: "approve-submissions",
  REJECT_SUBMISSIONS: "reject-submissions",
  APPROVE_CLAIMS: "approve-claims",
  REJECT_CLAIM: "reject-claim",
  DELETE_CATEGORY: "delete-category",
  DELETE_CATEGORIES: "delete-categories",

  // Reviews
  APPROVE_REVIEW: "approve-review",
  APPROVE_REVIEWS: "approve-reviews",

  // Prompts
  APPROVE_MODERATION: "approve-moderation",
  REJECT_MODERATION: "reject-moderation",
  APPROVE_MODERATIONS: "approve-moderations",
  REJECT_MODERATIONS: "reject-moderations",

  // Users
  BAN_USER: "ban-user",
  SUSPEND_USER: "suspend-user",
  ACTIVATE_USER: "activate-user",
  BAN_USERS: "ban-users",
  SUSPEND_USERS: "suspend-users",
  ACTIVATE_USERS: "activate-users",
} as const;

// CSS Classes
export const ACTION_CLASSES = {
  DEFAULT: "cursor-pointer hover:bg-black",
  PRIMARY: "cursor-pointer hover:bg-primary",
  DANGER: "cursor-pointer hover:bg-red-500",
  DISABLED: "text-gray-400 cursor-not-allowed",
} as const;

// Icons
export const ACTION_ICONS = {
  VIEW: "/icons/view.svg",
  VIEW_PROFILE: "/icons/view-profile.svg",
  EDIT: "/icons/edit.svg",
  DELETE: "/icons/trash.svg",
  APPROVE: "/icons/checkmark.svg",
  REJECT: "/icons/ban.svg",
  BAN: "/icons/info.svg",
  SUSPEND: "/icons/suspend.svg",
} as const;

export type ActionItem = {
  key: string;
  label: string;
  icon: string;
  disabled?: boolean;
  className?: string;
};

export type ActionMenuConfig = {
  rowActions: ActionItem[];
  bulkActions: ActionItem[];
};

// Action Definitions
const ACTIONS = {
  tools: {
    categories: {
      row: [
      ],
      bulk: [
      
      ],
    },
    submissions: {
      row: [
        { key: ACTION_KEYS.VIEW, label: "View", icon: ACTION_ICONS.VIEW },
        {
          key: ACTION_KEYS.APPROVE_SUBMISSION,
          label: "Approve submission",
          icon: ACTION_ICONS.APPROVE,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.REJECT_SUBMISSION,
          label: "Reject submission",
          icon: ACTION_ICONS.REJECT,
          className: ACTION_CLASSES.DANGER,
        },
        {
          key: ACTION_KEYS.DELETE,
          label: "Remove",
          icon: ACTION_ICONS.DELETE,
          className: ACTION_CLASSES.PRIMARY,
        },
      ],
      bulk: [
        {
          key: ACTION_KEYS.APPROVE_SUBMISSIONS,
          label: "Approve submissions",
          icon: ACTION_ICONS.APPROVE,
        },
        {
          key: ACTION_KEYS.DELETE_MULTIPLE,
          label: "Remove tools",
          icon: ACTION_ICONS.DELETE,
        },
      ],
    },
    claims: {
      row: [
        { key: ACTION_KEYS.VIEW, label: "View", icon: ACTION_ICONS.VIEW },        {
          key: ACTION_KEYS.APPROVE_CLAIM,
          label: "Approve claim",
          icon: ACTION_ICONS.APPROVE,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.DELETE,
          label: "Remove",
          icon: ACTION_ICONS.DELETE,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.REJECT_CLAIM,
          label: "Reject claim",
          icon: ACTION_ICONS.REJECT,
          className: ACTION_CLASSES.DANGER,
        },
      ],
      bulk: [
        {
          key: ACTION_KEYS.APPROVE_CLAIMS,
          label: "Approve claims",
          icon: ACTION_ICONS.APPROVE,
        },
        {
          key: ACTION_KEYS.DELETE_MULTIPLE,
          label: "Remove claims",
          icon: ACTION_ICONS.DELETE,
        },
      ],
    },

    tools: {
      row: [
        { key: ACTION_KEYS.VIEW, label: "View", icon: ACTION_ICONS.VIEW },
        { key: ACTION_KEYS.EDIT, label: "Edit", icon: ACTION_ICONS.EDIT },
        {
          key: ACTION_KEYS.DELETE,
          label: "Remove",
          icon: ACTION_ICONS.DELETE,
          className: ACTION_CLASSES.PRIMARY,
        },
      ],
      bulk: [
        {
          key: ACTION_KEYS.DELETE_MULTIPLE,
          label: "Remove tools",
          icon: ACTION_ICONS.DELETE,
        },
      ],
    },
  },
  reviews: {
    review: {
      row: [
        { key: ACTION_KEYS.VIEW, label: "View", icon: ACTION_ICONS.VIEW },
        {
          key: ACTION_KEYS.APPROVE_REVIEW,
          label: "Approve",
          icon: ACTION_ICONS.APPROVE,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.DELETE,
          label: "Remove",
          icon: ACTION_ICONS.DELETE,
          className: ACTION_CLASSES.PRIMARY,
        },
      ],
      bulk: [
        {
          key: ACTION_KEYS.APPROVE_REVIEWS,
          label: "Approve all",
          icon: ACTION_ICONS.APPROVE,
        },
        {
          key: ACTION_KEYS.DELETE_MULTIPLE,
          label: "Remove reviews",
          icon: ACTION_ICONS.DELETE,
        },
      ],
    },
  },
  prompts: {
    default: {
      row: [
        { key: ACTION_KEYS.VIEW, label: "View", icon: ACTION_ICONS.VIEW },
        { key: ACTION_KEYS.EDIT, label: "Edit", icon: ACTION_ICONS.EDIT },
        {
          key: ACTION_KEYS.APPROVE_MODERATION,
          label: "Approve moderation",
          icon: ACTION_ICONS.APPROVE,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.REJECT_MODERATION,
          label: "Reject moderation",
          icon: ACTION_ICONS.REJECT,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.DELETE,
          label: "Remove",
          icon: ACTION_ICONS.DELETE,
          className: ACTION_CLASSES.PRIMARY,
        },
      ],
      bulk: [
        {
          key: ACTION_KEYS.APPROVE_MODERATIONS,
          label: "Approve moderations",
          icon: ACTION_ICONS.APPROVE,
        },
        {
          key: ACTION_KEYS.DELETE_MULTIPLE,
          label: "Remove prompts",
          icon: ACTION_ICONS.DELETE,
        },
      ],
    },
  },
  glossary: {
    default: {
      row: [
        { key: ACTION_KEYS.VIEW, label: "View", icon: ACTION_ICONS.VIEW },
        { key: ACTION_KEYS.EDIT, label: "Edit", icon: ACTION_ICONS.EDIT },
        {
          key: ACTION_KEYS.APPROVE_MODERATION,
          label: "Approve moderation",
          icon: ACTION_ICONS.APPROVE,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.REJECT_MODERATION,
          label: "Reject moderation",
          icon: ACTION_ICONS.REJECT,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.DELETE,
          label: "Remove",
          icon: ACTION_ICONS.DELETE,
          className: ACTION_CLASSES.PRIMARY,
        },
      ],
      bulk: [
        {
          key: ACTION_KEYS.APPROVE_MODERATIONS,
          label: "Approve moderations",
          icon: ACTION_ICONS.APPROVE,
        },
        {
          key: ACTION_KEYS.DELETE_MULTIPLE,
          label: "Remove prompts",
          icon: ACTION_ICONS.DELETE,
        },
      ],
    },
  },
  learning: {
    default: {
      row: [
        { key: ACTION_KEYS.VIEW, label: "View", icon: ACTION_ICONS.VIEW },
        { key: ACTION_KEYS.EDIT, label: "Edit", icon: ACTION_ICONS.EDIT },
        {
          key: ACTION_KEYS.APPROVE_MODERATION,
          label: "Approve moderation",
          icon: ACTION_ICONS.APPROVE,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.REJECT_MODERATION,
          label: "Reject moderation",
          icon: ACTION_ICONS.REJECT,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.DELETE,
          label: "Remove",
          icon: ACTION_ICONS.DELETE,
          className: ACTION_CLASSES.PRIMARY,
        },
      ],
      bulk: [
        {
          key: ACTION_KEYS.APPROVE_MODERATIONS,
          label: "Approve moderations",
          icon: ACTION_ICONS.APPROVE,
        },
        {
          key: ACTION_KEYS.DELETE_MULTIPLE,
          label: "Remove prompts",
          icon: ACTION_ICONS.DELETE,
        },
      ],
    },
  },
  news: {
    default: {
      row: [
        { key: ACTION_KEYS.VIEW, label: "View", icon: ACTION_ICONS.VIEW },
        { key: ACTION_KEYS.EDIT, label: "Edit", icon: ACTION_ICONS.EDIT },
        {
          key: ACTION_KEYS.DELETE,
          label: "Remove",
          icon: ACTION_ICONS.DELETE,
          className: ACTION_CLASSES.PRIMARY,
        },
      ],
      bulk: [
        {
          key: ACTION_KEYS.APPROVE_MODERATIONS,
          label: "Approve moderations",
          icon: ACTION_ICONS.APPROVE,
        },
        {
          key: ACTION_KEYS.DELETE_MULTIPLE,
          label: "Remove news",
          icon: ACTION_ICONS.DELETE,
        },
      ],
    },
  },
  article: {
    default: {
      row: [
        { key: ACTION_KEYS.VIEW, label: "View", icon: ACTION_ICONS.VIEW },
        { key: ACTION_KEYS.EDIT, label: "Edit", icon: ACTION_ICONS.EDIT },
        {
          key: ACTION_KEYS.APPROVE_MODERATION,
          label: "Approve moderation",
          icon: ACTION_ICONS.APPROVE,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.REJECT_MODERATION,
          label: "Reject moderation",
          icon: ACTION_ICONS.REJECT,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.DELETE,
          label: "Remove",
          icon: ACTION_ICONS.DELETE,
          className: ACTION_CLASSES.PRIMARY,
        },
      ],
      bulk: [
        {
          key: ACTION_KEYS.APPROVE_MODERATIONS,
          label: "Approve moderations",
          icon: ACTION_ICONS.APPROVE,
        },
        {
          key: ACTION_KEYS.DELETE_MULTIPLE,
          label: "Remove prompts",
          icon: ACTION_ICONS.DELETE,
        },
      ],
    },
  },
  users: {
    default: {
      row: [
        {
          key: ACTION_KEYS.VIEW,
          label: "View Profile",
          icon: ACTION_ICONS.VIEW_PROFILE,
        },
        { key: ACTION_KEYS.EDIT, label: "Edit", icon: ACTION_ICONS.EDIT },
        {
          key: ACTION_KEYS.BAN_USER,
          label: "Ban",
          icon: ACTION_ICONS.BAN,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.SUSPEND_USER,
          label: "Suspend",
          icon: ACTION_ICONS.SUSPEND,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.ACTIVATE_USER,
          label: "Activate",
          icon: ACTION_ICONS.BAN,
          className: ACTION_CLASSES.PRIMARY,
        },
        {
          key: ACTION_KEYS.DELETE,
          label: "Delete",
          icon: ACTION_ICONS.DELETE,
          className: ACTION_CLASSES.PRIMARY,
        },
      ],
      bulk: [
        {
          key: ACTION_KEYS.BAN_USERS,
          label: "Ban all",
          icon: ACTION_ICONS.BAN,
        },
        {
          key: ACTION_KEYS.SUSPEND_USERS,
          label: "Suspend all",
          icon: ACTION_ICONS.SUSPEND,
        },
        {
          key: ACTION_KEYS.ACTIVATE_USERS,
          label: "Activate all",
          icon: ACTION_ICONS.BAN,
        },
        {
          key: ACTION_KEYS.DELETE_MULTIPLE,
          label: "Delete users",
          icon: ACTION_ICONS.DELETE,
        },
      ],
    },
  },
};

export const useActionMenu = (
  type: ScreenType,
  selectedTab: string | null,
  row: any
): ActionMenuConfig => {
  const getActions = (): { row: ActionItem[]; bulk: ActionItem[] } => {
    // Get base actions based on type and tab
    let actions;

    if (type === "tools") {
      if (selectedTab === TOOL_TABS.tools) {
        actions = ACTIONS.tools.tools;
      }
      else if (selectedTab === TOOL_TABS.tool_categories) {
        actions = ACTIONS.tools.categories;
      }
      else if (selectedTab === TOOL_TABS.tool_submissions) {
        actions = ACTIONS.tools.submissions;
      } else if (selectedTab === TOOL_TABS.tool_claims) {
        actions = ACTIONS.tools.claims;
      } else {
        actions = ACTIONS.tools.submissions; // fallback
      }
    } 
    
    
    
    else if (type === "reviews" && selectedTab === REVIEWS_TABS.review) {
      actions = ACTIONS.reviews.review;
    } else if (type === "prompts") {
      actions = ACTIONS.prompts.default;
    } else if (type === "glossary") {
      actions = ACTIONS.glossary.default;
    } else if (type === "learning") {
      actions = ACTIONS.learning.default;
    } else if (type === "articles") {
      actions = ACTIONS.learning.default;
    } else if (type === "news") {
      actions = ACTIONS.news.default;
    } else if (type === "users") {
      actions = ACTIONS.users.default;
    } else {
      actions = {
        row: [
          { key: ACTION_KEYS.VIEW, label: "View", icon: ACTION_ICONS.VIEW },
          {
            key: ACTION_KEYS.DELETE,
            label: "Remove",
            icon: ACTION_ICONS.DELETE,
            className: ACTION_CLASSES.PRIMARY,
          },
        ],
        bulk: [
          {
            key: ACTION_KEYS.DELETE_MULTIPLE,
            label: "Remove items",
            icon: ACTION_ICONS.DELETE,
          },
        ],
      };
    }

    return actions;
  };

  const applyDisabledStates = (actions: ActionItem[]): ActionItem[] => {
    return actions.map((action) => {
      let disabled = false;

      if (row) {
        switch (action.key) {
          case ACTION_KEYS.APPROVE_SUBMISSION:
          case ACTION_KEYS.APPROVE_CLAIM:
            disabled = row?.status === ToolsStatus.Approved;
            break;
          case ACTION_KEYS.REJECT_SUBMISSION:
            disabled = row?.status === ToolsStatus.Rejected;
            break;
          case ACTION_KEYS.APPROVE_REVIEW:
            disabled = row?.status === "Approved";
            break;
          case ACTION_KEYS.APPROVE_MODERATION:
            disabled = row?.moderation_status === "Approved";
            break;
          case ACTION_KEYS.REJECT_MODERATION:
            disabled = row?.moderation_status === "Rejected";
            break;
          case ACTION_KEYS.BAN_USER:
            disabled = row?.status === "Banned";
            break;
          case ACTION_KEYS.SUSPEND_USER:
            disabled = row?.status === "Suspended";
            break;
          case ACTION_KEYS.ACTIVATE_USER:
            disabled = row?.status === "Active";
            break;
        }
      }

      return {
        ...action,
        disabled,
        className: disabled
          ? ACTION_CLASSES.DISABLED
          : action.className || ACTION_CLASSES.DEFAULT,
      };
    });
  };

  const actions = getActions();

  return {
    rowActions: applyDisabledStates(actions.row),
    bulkActions: actions.bulk,
  };
};

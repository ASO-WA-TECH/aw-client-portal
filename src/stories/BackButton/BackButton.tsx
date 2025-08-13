import React from "react";
import "./BackButton.scss";

export interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`back-button`}
      role="button"
      aria-label="Back"
    />
  );
};

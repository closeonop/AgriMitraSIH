import * as React from "react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from 'react';
import { cn } from "../../utils/cn";

export interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(
  (
    {
      label,
      containerClassName,
      labelClassName,
      inputClassName,
      type = "text",
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (value) {
        setHasValue(String(value).length > 0);
      }
    }, [value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    const isFloating = isFocused || hasValue;

    return (
      <div className={cn("relative", containerClassName)}>
        <input
          ref={ref || inputRef}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "peer w-full px-4 pt-7 pb-3 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
            "placeholder-transparent",
            inputClassName
          )}
          placeholder=" "
          {...props}
        />
        <motion.label
          initial={false}
          animate={{
            top: isFloating ? "0.75rem" : "1.5rem",
            fontSize: isFloating ? "0.75rem" : "0.875rem",
            color: isFocused
              ? "rgb(59 130 246)" // blue-500
              : hasValue
              ? "rgb(75 85 99)" // gray-600
              : "rgb(156 163 175)", // gray-400
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className={cn(
            "absolute left-4 pointer-events-none origin-left z-20",
            "peer-focus:text-blue-500 dark:peer-focus:text-blue-400",
            labelClassName
          )}
          htmlFor={props.id}
        >
          {label}
        </motion.label>
        
        {/* Focus ring effect */}
        <motion.div
          initial={false}
          animate={{
            scale: isFocused ? 1 : 0,
            opacity: isFocused ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-lg border-2 border-blue-500 pointer-events-none"
        />
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export interface FloatingLabelTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
}

export const FloatingLabelTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FloatingLabelTextareaProps
>(
  (
    {
      label,
      containerClassName,
      labelClassName,
      textareaClassName,
      value,
      onChange,
      onFocus,
      onBlur,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (value) {
        setHasValue(String(value).length > 0);
      }
    }, [value]);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    const isFloating = isFocused || hasValue;

    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          ref={ref || textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows}
          className={cn(
            "peer w-full px-4 pt-7 pb-3 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical",
            "placeholder-transparent",
            textareaClassName
          )}
          placeholder=" "
          {...props}
        />
        <motion.label
          initial={false}
          animate={{
            top: isFloating ? "0.75rem" : "1.5rem",
            fontSize: isFloating ? "0.75rem" : "0.875rem",
            color: isFocused
              ? "rgb(59 130 246)" // blue-500
              : hasValue
              ? "rgb(75 85 99)" // gray-600
              : "rgb(156 163 175)", // gray-400
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className={cn(
            "absolute left-4 pointer-events-none origin-left z-20",
            "peer-focus:text-blue-500 dark:peer-focus:text-blue-400",
            labelClassName
          )}
          htmlFor={props.id}
        >
          {label}
        </motion.label>
        
        {/* Focus ring effect */}
        <motion.div
          initial={false}
          animate={{
            scale: isFocused ? 1 : 0,
            opacity: isFocused ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-lg border-2 border-blue-500 pointer-events-none"
        />
      </div>
    );
  }
);

FloatingLabelTextarea.displayName = "FloatingLabelTextarea";
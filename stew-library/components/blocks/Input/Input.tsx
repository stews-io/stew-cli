import { JSX } from "../../../deps/preact/mod.ts";
import {
  Button,
  ButtonProps,
} from "../../../../stew-library/components/mod.ts";
import { CssClass, getCssClass } from "stew/utilities/getCssClass.ts";
// @deno-types="CssModule"
import cssModule from "./Input.module.scss";

export interface InputProps
  extends Pick<
    JSX.IntrinsicElements["input"],
    "placeholder" | "value" | "onInput" | "onFocus"
  > {
  inputContainerClassname?: CssClass;
  textInputClassname?: CssClass;
  inputRef?: JSX.IntrinsicElements["input"]["ref"];
  clearButtonProps: Pick<
    ButtonProps,
    "ariaLabel" | "ariaDescription" | "onFocus" | "onSelect"
  >;
}

export function Input(props: InputProps) {
  const {
    inputContainerClassname,
    textInputClassname,
    inputRef,
    placeholder,
    value,
    onFocus,
    onInput,
    clearButtonProps,
  } = props;
  return (
    <div
      className={getCssClass(cssModule.inputContainer, [
        inputContainerClassname,
        Boolean(inputContainerClassname),
      ])}
    >
      <input
        className={getCssClass(cssModule.textInput, [
          textInputClassname,
          Boolean(textInputClassname),
        ])}
        type={"text"}
        autocomplete={"off"}
        autocorrect={"off"}
        autocapitalize={"off"}
        spellcheck={false}
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onFocus={onFocus}
        onInput={onInput}
      />
      <Button {...clearButtonProps}>
        <svg className={cssModule.clearInputIcon} viewBox={"0 0.5 23 23"}>
          <path
            className={cssModule.iconOutlineCircle}
            d={
              "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10 S17.53 2 12 2z"
            }
          />
          <path
            d={
              "M12 2m4.3 14.3c-.39.39-1.02.39-1.41 0L12 13.41 9.11 16.3c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41L10.59 12 7.7 9.11c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L12 10.59l2.89-2.89c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z"
            }
          />
        </svg>
      </Button>
    </div>
  );
}

import { CssClass, getCssClass } from "stew/utilities/getCssClass.ts";
import { FunctionComponent, JSX } from "../../../deps/preact/mod.ts";
// @deno-types="CssModule"
import cssModule from "./Input.module.scss";

export interface InputProps<InputDecoratorProps extends Record<string, any>>
  extends Pick<
    JSX.IntrinsicElements["input"],
    "placeholder" | "value" | "onInput" | "onFocus"
  > {
  inputContainerClassname?: CssClass;
  textInputClassname?: CssClass;
  inputRef?: JSX.IntrinsicElements["input"]["ref"];
  InputDecorator: FunctionComponent<InputDecoratorProps>;
  inputDecoratorProps: InputDecoratorProps;
}

export function Input<InputDecoratorProps extends Record<string, any>>(
  props: InputProps<InputDecoratorProps>
) {
  const {
    inputContainerClassname,
    textInputClassname,
    inputRef,
    placeholder,
    value,
    onFocus,
    onInput,
    InputDecorator,
    inputDecoratorProps,
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
      <InputDecorator {...inputDecoratorProps} />
    </div>
  );
}

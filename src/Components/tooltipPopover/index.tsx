import * as Popper from "@popperjs/core";
import Tippy from "@tippyjs/react";
import { roundArrow } from "tippy.js";
import "tippy.js/animations/shift-away-subtle.css";
import "tippy.js/dist/svg-arrow.css";
// import "tippy.js/dist/tippy.css";
import { memo } from "react";
import "tippy.js/themes/light.css";
import classNames from "classnames";
import { Placement } from "@popperjs/core";
interface Props {
  content: string | React.ReactNode;
  children: React.ReactElement;
  allowHtml?: boolean;
  arrow?: boolean;
  delay?: number | [number | null, number | null];
  disabled?: boolean;
  interactive?: boolean;
  maxWidth?: number | string;
  placement?: Popper.Placement | undefined;
  trigger?: "click" | "focus" | "mouseenter";
  rounded?: string;
  offset?:
    | [number, number]
    | (({
        placement,
        popper,
        reference,
      }: {
        placement: Placement;
        popper: Popper.Rect;
        reference: Popper.Rect;
      }) => [number, number]);
  className?: string;
}
const Tooltip: React.FC<Props> = ({
  content,
  children,
  allowHtml,
  arrow,
  delay,
  disabled,
  interactive,
  maxWidth,
  trigger,
  placement,
  rounded,
  offset,
  className,
}) => {
  return (
    <Tippy
      className={classNames(
        "shadow-primaryShadow bg-white",
        rounded || "rounded-2xl",
        className
      )}
      onShown={(instance: any) => {
        document
          ?.querySelector("[data-tippy-root]")
          ?.addEventListener("click", (event) => {
            instance.hide();
          });
      }}
      onTrigger={(inst, e) => e.stopPropagation()}
      placement={placement || "bottom"}
      content={content}
      allowHTML={allowHtml}
      animation="shift-away-subtle"
      arrow={arrow ? roundArrow : false}
      delay={delay}
      disabled={disabled}
      interactive={interactive}
      maxWidth={maxWidth}
      theme="light"
      trigger={trigger}
      appendTo={document.body}
      offset={offset || [0, 10]}
    >
      {children}
    </Tippy>
  );
};

export default memo(Tooltip);
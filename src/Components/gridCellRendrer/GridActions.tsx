import { useMemo } from "react";
import classNames from "classnames";
import { HiDotsVertical } from "react-icons/hi";
import TooltipPopover from "../tooltipPopover";
export type GridActionsParam = {
  callback: (gridParams: any) => void;
  label: string;
  title?: string;
  hide?: boolean;
  className?: string;
};
interface GridActions {
  actions: GridActionsParam[];
  gridParams: any;
}

const GridActions: React.FC<GridActions> = ({ actions, gridParams }) => {
  const _actions = useMemo(
    () => actions.filter((action) => !action.hide),
    [actions]
  );
  if (!_actions.length) return <></>;
  return (
    <>
      <div className="flex items-center h-full cursor-pointer">
        <TooltipPopover
          trigger="click"
          interactive
          rounded="rounded-md"
          placement="left-start"
          offset={[0, -10]}
          content={
            <div className="z-[100] max-w-28">
              {_actions.map(({ callback, label, title, className }, id) => (
                <div
                  key={id}
                  className={classNames(
                    "flex text-sm px-3 py-1 w-full hover:bg-primary/30 cursor-pointer",
                    className
                  )}
                  onClick={() => callback(gridParams)}
                  title={title}
                >
                  {label}
                </div>
              ))}
            </div>
          }
        >
          <div>
            <HiDotsVertical />
          </div>
        </TooltipPopover>
      </div>
    </>
  );
};
export default GridActions;

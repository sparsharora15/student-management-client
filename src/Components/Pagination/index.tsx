import classNames from "classnames";
import React, { memo, useEffect } from "react";
import {
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import ReactPaginate from "react-paginate";

interface Props {
  pageRangeDisplayed?: number;
  pageCount: number;
  forcePage?: number;
  handlePageClick?: any;
}
const Pagination: React.FC<Props> = ({
  pageRangeDisplayed,
  pageCount,
  forcePage = 0,
  handlePageClick,
}) => {
  return (
    <div className="w-fit items-center justify-end  pt-[15px]">
      <ReactPaginate
        breakLabel="..."
        className="flex gap-2 items-center"
        onPageChange={handlePageClick}
        initialPage={0}
        pageRangeDisplayed={pageRangeDisplayed}
        pageCount={pageCount || 0}
        forcePage={forcePage || 0}
        pageClassName="  grid  place-items-center w-9 h-9"
        activeClassName="text-white bg-[#1B5299] rounded w-9 h-9"
        activeLinkClassName="text-white"
        renderOnZeroPageCount={() => null}
        previousLabel={
          <div className={classNames(" shadow-tertiaryShadow")}>
            <HiOutlineChevronLeft
              className={classNames(
                "filter drop-shadow-primaryShadow  text-primary text-xl ",
                "text-primary"
              )}
            />
          </div>
        }
        nextLabel={
          <div
            className={classNames(
              "",
              pageCount === 1 || pageCount - 1 === forcePage
                ? "cursor-not-allowed"
                : " shadow-tertiaryShadow"
            )}
          >
            <HiOutlineChevronRight
              className={classNames(
                "filter drop-shadow-primaryShadow text-primary text-xl",
                pageCount === 1 || pageCount - 1 === forcePage
                  ? " text-septenary/50 cursor-not-allowed"
                  : "text-primary"
              )}
            />
          </div>
        }
      />
    </div>
  );
};

export default memo(Pagination);

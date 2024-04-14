import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
// import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { BsThreeDotsVertical } from "react-icons/bs";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const ITEM_HEIGHT = 48;
export default function Grid({
  columnDefs,
  rowData,
  pagination,
  height,
  className,
  pageCount,
  pageHandler,
  innerRef,
  ...otherProps
}: any) {
  const [updateopen, setUpdateOpen] = useState(false);
  const handleUpdateOpen = () => setUpdateOpen(true);
  const handleUpdateClose = () => setUpdateOpen(false);

  const UpdateStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const Actions = () => {
    return (
      <div>
        {/* <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <Button
                className="text-black cursor-pointer"
                {...bindTrigger(popupState)}
              >
                <BsThreeDotsVertical />
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem>
                  <p className="font-inter text-[#2C2C2C]">Update</p>
                </MenuItem>
                <MenuItem>
                  <p className="font-inter text-[#2C2C2C]">Mark Geofence</p>
                </MenuItem>
                <MenuItem>
                  <p className="font-inter text-[#b92f2f]">Archive</p>
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState> */}
        {/* <Modal
          open={updateopen}
          onClose={handleUpdateClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={UpdateStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal> */}
      </div>
    );
  };

  const defaultColDef = {
    sortable: true,
    filter: false,
    resizable: false,
    flex: 1,
    headerClass: "ag-header-custom",
  };

  return (
    <div>
      <div
        className={"ag-theme-alpine font-inter border-none " + className}
        style={{
          height: height,
          width: "100%",
          fontFamily: "inter",
          border: "none",
          overflowY: "auto",
        }}
      >
        <AgGridReact
          ref={innerRef}
          defaultColDef={{ suppressMovable: true }}
          columnDefs={columnDefs}
          rowData={rowData}
          overlayNoRowsTemplate={"No data found"}
          className=".ag-overlay-loading-center "
          tooltipShowDelay={0}
          tooltipHideDelay={2000}
          {...otherProps}
          // alwaysShowVerticalScroll={true}
          // pagination={pagination}
          // paginationPageSize={8}
          // domLayout={"autoHeight"}
        />
      </div>
      <div className="flex w-full justify-end"></div>
    </div>
  );
}

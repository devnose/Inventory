import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { useTheme, Typography } from "@mui/material";
import { Box, Button, Tooltip } from "@mui/material";
import { tokens } from "../../theme";



export const getPrinterGridColumns = (colors) => {


  return [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "manufacture", headerName: "Manufacture", flex: 0.7 },

    {
      field: "model",
      headerName: "Model",
      flex: 0.7,
    },
    {
      field: "serial",
      headerName: "Serial Number",
      flex: 0.7,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      renderCell: ({ row: { status } }) => {
      
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              status === "IN"
                ? colors.blueAccent[700]
                : status === "OUT"
                ? colors.redAccent[700]
                : colors.redAccent[700]
            }
            borderRadius="4px"
          >
            {status === "IN" && <AdminPanelSettingsOutlinedIcon />}
            {status === "OUT" && <SecurityOutlinedIcon />}
            {status === "user" && <LockOpenOutlinedIcon />}
            <Tooltip title={status + status + status}>
              <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                {status}
              </Typography>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

}
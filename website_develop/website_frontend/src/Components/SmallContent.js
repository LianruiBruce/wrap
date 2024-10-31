import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DeleteIcon from "@mui/icons-material/Delete"; // 添加删除图标

const Content = ({
  summaryContentRef,
  backgroundStyle,
  paperStyle,
  titleStyle,
  helpIconStyle,
  onDelete,
}) => {
  return (
    <Box sx={backgroundStyle}>
      <Grid container spacing={2}>
        {/* General Summary */}
        <Grid item xs={12}>
          <Paper sx={paperStyle}>
            <Typography variant="h6" gutterBottom sx={titleStyle}>
              General Summary
            </Typography>
            <Tooltip title="Report Info">
              <IconButton color="inherit" sx={helpIconStyle}>
                <HelpOutlineIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </Tooltip>

            <Typography
              variant="body1"
              color="text.secondary"
              style={{ whiteSpace: "pre-wrap", marginTop: "16px" }}
            >
              {summaryContentRef}
            </Typography>

            {/* 删除按钮 */}
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={onDelete}
              style={{ float: "right" }}
            >
              <DeleteIcon />
            </IconButton>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Content;

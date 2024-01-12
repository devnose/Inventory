import React, { createElement } from "react";
import PropTypes from "prop-types";
import { Card, Box, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const CardWithIcon = ({ icon, title, subtitle, to, children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card
      sx={{
        minHeight: 52,
        display: "flex",
        flexDirection: "column",
        flex: "1",
        "& a": {
          textDecoration: "none",
          color: "inherit",
        },
      }}
    >
      <Link to={to}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            backgroundColor: colors.primary[300],
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            "& .icon": {
              color: "secondary.main",
              scale: "150%",
            },
            "&:before": {
              position: "absolute",
              top: "50%",
              left: 0,
              display: "block",
              content: `''`,
              height: "200%",
              aspectRatio: "1",
              transform: "translate(-30%, -60%)",
              borderRadius: "50%",
              backgroundColor: colors.primary[960],
              opacity: 0.15,
            },
          }}
        >
          <Box width="3em" className="icon">
            {createElement(icon, { fontSize: "large" })}
          </Box>
          <Box textAlign="right">
            <Typography color="textSecondary" variant="h3">
              {title}
            </Typography>
            <Typography variant="h1" component="h2">
              {subtitle || " "}
            </Typography>
          </Box>
        </Box>
      </Link>
      {children && <Divider />}
      {children}
    </Card>
  );
};
CardWithIcon.propTypes = {
  icon: PropTypes.func.isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.node,
  children: PropTypes.node,
};

export default CardWithIcon;

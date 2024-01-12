import React from 'react';
import PropTypes from 'prop-types';
import DollarIcon from '@mui/icons-material/AttachMoney';

import CardWithIcon from './Card';

const MonthlyRevenue = (props) => {
    const { value, icon, title} = props;
    return (
        <CardWithIcon
            to="/commands"
            icon={icon}
            title={title}
            subtitle={value}
        />
    );
};

MonthlyRevenue.propTypes = {
    value: PropTypes.string,
    icon: PropTypes.func, // You can specify the expected type for 'icon' prop
    title: PropTypes.func
};

export default MonthlyRevenue;

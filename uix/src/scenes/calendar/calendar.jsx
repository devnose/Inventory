import React, { useState } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import CreateEvent from "./createEvent";
import EditEvent from "./editEvent";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState(null)
  const [iniatialEvents, setEvents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);  
  const [eventSelect, setEventSelect] = React.useState(''); 
  const [selectedTime, setSelectedTime] = React.useState(null)
  const [dbEvent, setDbEvent] = React.useState(null)

  const handleClose = () => setOpen(false); 
  const handleEditClose = () => setEditOpen(false); 

  const handleDelete = (selected) => {

    console.log(selected)

    //Confirmation dialog
    if(window.confirm(`Are you sure you want to delete the event ${selected.title}`)) {
      const eventToDelete = iniatialEvents.find(event => event.id === selected.id);
      
      //Api call
      const requestOptions = {
        method: "DELETE", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: eventToDelete.id})
      }; 

      fetch("/oe/api/calender/delete", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data); 
          setEvents(iniatialEvents.filter(event => event.id !== eventToDelete.id)); 
        }); 

    } 



  }



  React.useEffect(() => {
    fetch("/oe/api/calender/retrive")
      .then((response) => response.json())
      .then((data) => {
        let result = data;
        console.log(data);
        setEvents([...result]);
      });
  }, []);

  const handleDbCalender = (events) => {
    const data = JSON.stringify(events[events.length - 1]);
    console.log(data);
    setCurrentEvents([...events]);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    };
    fetch("/oe/api/calender/add", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const handleDateClick = (selected) => {

    // setSelectedEvents({
    //   title: selected.event.title,
    //   location: clickInfo.location,
    //   startTime: selected.startStr
    // })


    setEventSelect(selected)
    setSelectedTime({start: selected.startStr, end: selected.endStr})

      setOpen(true)


    // const title = prompt("Please enter a new title for your event");
    // const calendarApi = selected.view.calendar;
    // calendarApi.unselect();

    // if (title) {
    //   calendarApi.addEvent({
    //     id: `${selected.dateStr}-${title}`,
    //     title,
    //     start: selected.startStr,
    //     end: selected.endStr,
    //     allDay: selected.allDay,
    //   });
    // }
  };

  const handleEventClick = (selected) => {
    // if (
    //   window.confirm(
    //     `Are you sure you want to delete the event '${selected.event.title}'`
    //   )
    // ) {
      // console.log(selected.event);
      // selected.event.remove();

      // const requestOptions = {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(selected.event),
      // };
      // fetch("/oe/api/calender/delete", requestOptions)
      //   .then((response) => response.json())
      //   .then((data) => console.log(data));
    // }

    const event = iniatialEvents.find(event => event.title === selected.event.title)
    setSelectedTime({start: event.start, end: event.end})
    setDbEvent(event); 
    setEditOpen(true)
    // setOpen(true)


  };

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        {/* <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
          sx={{
            zIndex: 1000, // Setting the z-index
            boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
          }}
        > */}
          {/* <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List> */}

          <CreateEvent openVar={open} onClose={handleClose} onDelete={handleDelete} selected={eventSelect} time={selectedTime} dbEvent={dbEvent ? dbEvent : false}/>
          <EditEvent open={editOpen} onClose={handleEditClose} onDelete={handleDelete} selected={eventSelect} time={selectedTime} dbEvent={dbEvent}/>

          {/* <List>
            {dataevents.map((event) => (
              
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >

                
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List> */}
        {/* </Box> */}

        {/* CALENDAR */}
        <Box
          flex="1 1 100%"
          ml="15px"
          sx={{
            zIndex: 1000, // Setting the z-index
            boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
          }}
        >
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={iniatialEvents}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => handleDbCalender(events)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;

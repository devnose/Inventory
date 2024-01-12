import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Grid, TextField, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import "./modal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditEvent = ({ open, onClose, onDelete, selected, time, dbEvent }) => {
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [startTime, setStartTime] = React.useState("12-13-2023");
  const [endTime, setEndTime] = React.useState("12-13-2023");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [isRepeating, setIsRepeating] = React.useState(false);

  const timeFormat = (dateString) => {
    const now = new Date();
    const [year, month, day] = dateString
      .split("-")
      .map((part) => parseInt(part));
    now.setFullYear(year, month - 1, day); // Month is 0-indexed in JavaScript Date
    const formattedDate = now.toISOString().slice(0, 16);
    return formattedDate;
  };

  React.useEffect(() => {
    if(open){
      setStartTime(time.start);
      setEndTime(time.end);
      setTitle(dbEvent.title);
      setLocation(dbEvent.location);
    }
  }, [open, dbEvent, time]); // Add dependencies here
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      title,
      location,
      startTime,
      endTime,
      description,
      category,
      isRepeating,
    };
    console.log(selected);
    selected.view.calendar.addEvent({
      id: `${selected.dateStr}-${title}`,
      title,
      location,
      description,
      category,
      start: selected.startStr,
      end: selected.endStr,
      allDay: selected.allDay,
    }); 

    setTitle("");
    setLocation("");
    setDescription("");
    setCategory("");
    setIsRepeating(false);
    onClose();
  };

  const handleDelete = (selected) => {
    // You can add logic here to handle the deletion of an event
    onClose()
    console.log("Event deleted");
    onDelete(dbEvent);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        onDelete={onDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header">
            <h2 className="modal-title">Event Details</h2>
          </div>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-body">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                  <option value="holiday">Holiday</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Time:</label>
                <input
                  type="datetime-local"
                  value={timeFormat(startTime)}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time:</label>
                <input
                  type="datetime-local"
                  value={timeFormat(endTime)}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={isRepeating}
                    onChange={(e) => setIsRepeating(e.target.checked)}
                  />
                  Repeating Event
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <div className="modal-actions">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                >
                  Save Event
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default EditEvent;

const router = require("express").Router();
const Calender = require("../Model/Calender");

router.post("/add", async (req, res) => {

const doesExist = await Calender.exists({id: req.body.id})

console.log(req.body.id)

if(doesExist != null) {

    console.log("record already exists");

} else {

    const newItem = new Calender(req.body);

  try {
    const savedItem = await newItem.save();
    res.status(200).json(savedItem);
  } catch (err) {
    res.status(500).json(err);
  }

}
});


router.get("/delete", async (req, res) => {
  const record = await Calender.deleteOne({id: req.body.id}); 
  res.status(200); 
})


router.get("/retrive", async (req, res) => {
    const filter = {};
    const all = await Calender.find(filter);
    res.send(all);
  });


  router.delete("/delete", async (req, res) => {

    console.log(req.body)
    
    const deleteEvent = await Calender.findOneAndDelete({id: req.body.id}); 

    console.log(deleteEvent);
       // It's good practice to send some response back
       if (deleteEvent) {
        res.status(200).json({ message: "Event deleted successfully" });
    } else {
        // If no event found with the given ID
        res.status(404).json({ message: "Event not found" });
    }

    res.status(200); 

  })


module.exports = router; 
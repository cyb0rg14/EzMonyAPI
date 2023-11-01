// Adds an email to the waitlist if it doesn't already exist.
const joinWaitlist = async (req, res) => {
  const email = req.body.email;
  const existingEmail = await Waitlist.findOne({ email: email });
  try {
    if (existingEmail) {
      return res
        .status(409)
        .json({ error: "Email already exists in the waitlist" });
    } else {
      const wlEmail = await Waitlist.create({ email });
      res.status(200).json(wlEmail);
    }
  } catch (error) {
    console.log("Error occurred while adding email to waitlist", error);
  }
};

export default joinWaitlist;

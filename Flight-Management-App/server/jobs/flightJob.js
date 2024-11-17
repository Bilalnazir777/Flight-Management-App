const { faker } = require("@faker-js/faker");
const Flight = require("../src/models/Flight");
const config = require("../config");
const { publishKafkaMessage } = require("../kafka/producer");
const generateRandomFlight = async () => {
  const flightFixture = {
    flightNumber: faker.string.alphanumeric(6).toUpperCase(),
    origin: faker.location.city(),
    destination: faker.location.city(),
    scheduledDepartureTime: faker.date.future(),
    status: faker.helpers.arrayElement([
      "Delayed",
      "Cancelled",
      "In-flight",
      "Scheduled/En Route",
    ]),
    flightType: faker.helpers.arrayElement([
      "Commercial",
      "Military",
      "Private",
    ]),
    airline: faker.helpers.arrayElement([
      "US Blue",
      "Ethihad",
      "PIA",
      "Emirates",
      "Qatar Airlines",
      "Air India",
    ]),
  };

  try {
    const newFlight = new Flight(flightFixture);
    await newFlight.save();
    publishKafkaMessage("flight_entry_created", "created");
    console.log(
      "New flight record has been created:",
      flightFixture.flightNumber
    );
  } catch (error) {
    console.error("Error occured while generating random flight:", error);
  }
};

setInterval(generateRandomFlight, config.tasks.createFlightInterval);

const updateFlightStatus = async () => {
  try {
    const flightsData = await Flight.find();

    if (flightsData.length === 0) {
      console.log("No flights is there to update status.");
      return;
    }

    const flightToUpdate = faker.helpers.arrayElement(flightsData);
    const newStatus = faker.helpers.arrayElement(["Cancelled", "Delayed"]);

    flightToUpdate.status = newStatus;

    await flightToUpdate.save();
    publishKafkaMessage("flight_entry_update", "updated");
    console.log(
      `Flight ${flightToUpdate.flightNumber}  record status has been updated to ${newStatus}`
    );
  } catch (error) {
    console.error("Error while updating the flight status:", error);
  }
};

setInterval(updateFlightStatus, config.tasks.updateFlightInterval);

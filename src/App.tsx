import { Amplify } from "aws-amplify";
import { events } from "aws-amplify/data";
import config from "../amplify_outputs.json";
import { signIn } from "aws-amplify/auth";
import { signOut } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

Amplify.configure(config);
// Amplify.configure({
//   API: {
//     Events: {
//       endpoint:
//         "https://sve2hepirveyfjothukm5fv2mu.ddpg-api.us-west-2.amazonaws.com/event",
//       region: "us-west-2",
//       defaultAuthMode: "apiKey",
//       apiKey: "da2-nj62mujhqrfuxbjv7wp2tbpsdy",
//     },
//   },
// });

// const client = generateClient<Schema>();

// const { errors, data: newTodo } = await client.models.Todo.create({
//   content: "My new todo",
// });

// if (errors) {
//   console.error("Errors occurred while creating the todo:");
//   errors.forEach((error, index) => {
//     console.error(`Error ${index + 1}:`, error);
//   });
// }

// // Subscribe to creation of Todo
// const createSub = client.models.Todo.onCreate().subscribe({
//   next: (data) => console.log(data),
//   error: (error) => console.warn(error),
// });

await signOut();
// await signIn({
//   username: "lzhouq@amazon.com",
//   password: "Jack3117!",
// });

// WSS Connect & Subscribe
let channel = await events.connect("test/events");
channel.subscribe({
  next: (data) => {
    console.log("received", data.event);
    console.log("type", typeof data.event);
  },
  error: (err) => console.error("test", err),
});
function App() {
  // publish event to channel via WS
  const publishSingleEvent = async () => {
    try {
      await channel.publish(
        { key: "my event content" },
        { authMode: "userPool" }
      );
      console.log("Single event published via WS");
    } catch (error) {
      console.error(error);
    }
  };

  // publish event to channel via WS
  const publishSingleEventNoAuth = async () => {
    try {
      await channel.publish({ key: "my event content" });
      console.log("Single event published via WS");
    } catch (error) {
      console.error("Error publishing single event:", error);
    }
  };

  // publish multiple events to channel via WS
  const publishMultipleEvents = async () => {
    try {
      await channel.publish([1, 2, 3], { authMode: "identityPool" });
      console.log("Multiple events published via WS");
    } catch (error) {
      console.error("Error publishing multiple events:", error);
    }
  };

  const publishRestSingle = async () => {
    try {
      await events.post(
        "/test/events",
        { some: "data" },
        { authMode: "identityPool" }
      );
      console.log("Single event published via REST");
    } catch (error) {
      console.error("Error publishing single event via REST:", error);
    }
  };

  const publishRestMultiple = async () => {
    try {
      await events.post("/test/events", [1, 2, 3]);
      console.log("Multiple events published via REST");
    } catch (error) {
      console.error("Error publishing multiple events via REST:", error);
    }
  };

  return (
    <main>
      <button onClick={publishSingleEvent}>Publish Single Event (WS)</button>
      <button onClick={publishSingleEventNoAuth}>
        Publish Single Event No Auth
      </button>
      <button onClick={publishMultipleEvents}>
        Publish Multiple Events (WS)
      </button>
      <button onClick={publishRestSingle}>Publish Single Event (REST)</button>
      <button onClick={publishRestMultiple}>
        Publish Multiple Events (REST)
      </button>
    </main>
  );
}

export default App;

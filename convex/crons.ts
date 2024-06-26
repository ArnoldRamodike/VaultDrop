import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Delete old files marked for deletion ",
  { minutes: 1 }, // every minute
  internal.files.deleteAllFile,
);

export default crons;
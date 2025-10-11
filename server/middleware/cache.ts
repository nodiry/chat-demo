import memjs from "memjs";
import logger from "./logger";

const memcached = memjs.Client.create("localhost:11211");
export function addUser(user: string, socket: string): Promise<void> {
  return new Promise((resolve, reject) => {
    memcached.set(user, socket, { expires: 3600 }, (err) => {
      if (err) {
        logger.error("Failed to store socket id", err);
        reject(err);
      } else resolve();
    });
  });
}
export function findUser(user: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    memcached.get(user, (err, data) => {
      if (err) {
        logger.error("Failed to retrieve socket id", err);
        reject(err);
      } else resolve(data ? data.toString() : null); 
    });
  });
}
export function removeUser(user: string): Promise<void> {
  return new Promise((resolve, reject) => {
    memcached.delete(user, (err) => {
      if (err) {
        logger.error("Failed to delete passcode", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

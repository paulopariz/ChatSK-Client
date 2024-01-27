export const playAudio = (path: string) => new Audio(path).play();

export const sendNotification = (title: string, options: object) =>
  new Notification(title, options);

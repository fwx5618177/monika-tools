export const isChromeExtension = () => {
  return (
    typeof chrome !== "undefined" &&
    typeof chrome.runtime !== "undefined" &&
    typeof chrome.storage !== "undefined"
  );
};

export const getData = (key: string): Promise<string | null> => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      chrome.storage.sync.get(key, (data) => {
        resolve(data[key] || null);
      });
    } else {
      const savedData = localStorage.getItem(key);
      resolve(savedData);
    }
  });
};

export const setData = (key: string, value: string): Promise<void> => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      chrome.storage.sync.set({ [key]: value }, () => {
        resolve();
      });
    } else {
      localStorage.setItem(key, value);
      resolve();
    }
  });
};

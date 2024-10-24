export default class SaveManager {
    static saveGame(data) {
      localStorage.setItem('saveData', JSON.stringify(data));
    }
  
    static loadGame() {
      const savedData = localStorage.getItem('saveData');
      return savedData ? JSON.parse(savedData) : null;
    }
  }
  
const Languages = require("./languages");

class CLIApplication {
  static getMessage(key) {
    if (CLIApplication.STRING_DATA_COLLECTION[key]) {
      return CLIApplication.STRING_DATA_COLLECTION[key];
    } else {
      return key;
    }
  }
  static STRING_DATA_COLLECTION = Languages.STRING_DATA_COLLECTION_DEFAULT;

  static ids = [];
  startupTime = undefined;
  ApplicationID = undefined;

  NodeExecutable = undefined;
  ModuleName = undefined;

  suppliedParamaters = [];

  supportedParamaters = [
    {
      Switch: "-v",
      Message: "Version 1",
      CallBack: function (Data) {
        console.log(this.Message);
      },
    },
    {
      Switch: "-jp",
      CallBack: function (Data) {
        CLIApplication.STRING_DATA_COLLECTION =
          Languages.STRING_DATA_COLLECTION_JP;
        console.log(CLIApplication.getMessage("ChangedLanguage"));
      },
    },
    {
      Switch: "-sk",
      CallBack: function (Data) {
        CLIApplication.STRING_DATA_COLLECTION =
          Languages.STRING_DATA_COLLECTION_SK;
        console.log(CLIApplication.getMessage("ChangedLanguage"));
      },
    },
    {
      Switch: "-fr",
      CallBack: function (Data) {
        CLIApplication.STRING_DATA_COLLECTION =
          Languages.STRING_DATA_COLLECTION_FR;
        console.log(CLIApplication.getMessage("ChangedLanguage"));
      },
    },
    {
      Switch: "-tk",
      CallBack: function (Data) {
        CLIApplication.STRING_DATA_COLLECTION =
          Languages.STRING_DATA_COLLECTION_TK;
        console.log(CLIApplication.getMessage("ChangedLanguage"));
      },
    },
  ];

  static generateARandomID(min, max) {
    let newID = Math.floor(Math.random() * (max - min) + min);
    if (CLIApplication.ids[newID] != undefined) {
      CLIApplication.ids.push(this.generateARandomID(newID++, newID + max));
    } else {
      CLIApplication.ids.push(newID);
      return newID;
    }
  }

  constructor(
    ApplicationName,
    process = require("process"),
    supportedParamaters
  ) {
    this.startupTime = Date.now();
    this.ApplicationID = CLIApplication.generateARandomID(0, 1000);
    this.ApplicationName = ApplicationName;
    // first argument can be called process.argv0 or process.argc[0]
    this.NodeExecutable = process.argv0;
    this.ModuleName = process.argv[1];

    if (process.argv.length > 2) {
      if (process.argv.length > 2) {
        this.suppliedParamaters = process.argv.slice(2, process.argv.length);
      }
    }
    for (let i = 0; i < supportedParamaters.length; i++) {
      this.supportedParamaters.push(supportedParamaters[i]);
    }
  }

  checkParams() {
    for (let i = 0; i < this.suppliedParamaters.length; i++) {
      for (let j = 0; j < this.supportedParamaters.length; j++) {
          //if there is command with more parameters it is expected to be in quotes seperated with space for example "-cf /Documents"
       if (this.suppliedParamaters[i].split(" ") && this.suppliedParamaters[i].split(" ")[0] === this.supportedParamaters[j].Switch) {
            this.supportedParamaters[j].CallBack(this.suppliedParamaters[i].split(" ")[1]);
        }else if (this.suppliedParamaters[i] === this.supportedParamaters[j].Switch) {
            this.supportedParamaters[j].CallBack(this);
        }
      }
    }
  }
}

module.exports = CLIApplication;

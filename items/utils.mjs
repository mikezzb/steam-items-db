import fs from "fs";

export class RarePatternsHelper {
  constructor(save_path = "rare_patterns.json") {
    if (fs.existsSync(save_path)) {
      const json_str = fs.readFileSync(save_path);
      this.json = JSON.parse(json_str);
    } else {
      this.json = {};
    }
    this.save_path = save_path;
  }
  recordTiers(itemName, tiers) {
    Object.entries(tiers).forEach(([tierName, paintseeds]) => {
      this.recordTier(itemName, tierName, paintseeds);
    });
  }
  recordTier(itemName, tierName, paintseeds) {
    if (!this.json[itemName]) {
      this.json[itemName] = {
        [tierName]: paintseeds,
      };
    } else {
      // merge with dedup
      const paintseedsSet = new Set([
        ...(this.json[itemName][tierName] || []),
        ...(paintseeds || []),
      ]);
      // make sure paintseeds are number
      this.json[itemName][tierName] = Array.from(paintseedsSet).map((x) =>
        Number(x)
      );
    }
  }
  tidy() {
    Object.keys(this.json).forEach((itemName) => {
      const tiers = this.json[itemName];
      Object.keys(tiers).forEach((tierName) => {
        const paintseeds = tiers[tierName].map((x) => Number(x));
        tiers[tierName] = paintseeds.sort((a, b) => a - b);
      });
    });
  }
  save() {
    const json_str = JSON.stringify(this.json, null, 2);
    fs.writeFileSync(this.save_path, json_str);
  }
}

// const r = new RarePatternsHelper();
// r.tidy();
// r.save();

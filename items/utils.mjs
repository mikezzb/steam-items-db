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
      this.json[itemName][tierName] = Array.from(paintseedsSet);
    }
  }
  save() {
    const json_str = JSON.stringify(this.json, null, 2);
    fs.writeFileSync(this.save_path, json_str);
  }
}

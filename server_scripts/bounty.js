function log(event, string) {
  // event.server.tell("LOG: " + string);
  console.log(string);
}

//TODO: REWARD RANDOM
//TODO: DELAY

function generateReward(finished) {
  if (finished >= 60) {
    return "kubejs:diamond_chowcoin";
  } else if (finished >= 40) {
    return "kubejs:gold_chowcoin";
  } else if (finished >= 20) {
    return "kubejs:iron_chowcoin";
  }
  return "kubejs:copper_chowcoin";
}

const multiplier = 1.5;
function generateAmount(finished) {
  if (finished >= 60) {
    return (4 - 90 + finished * multiplier).toFixed(0);
  } else if (finished >= 40) {
    return (4 - 60 + finished * multiplier).toFixed(0);
  } else if (finished >= 20) {
    return (4 - 30 + finished * multiplier).toFixed(0);
  }
  return (4 + finished * multiplier).toFixed(0);
}

function isIncluded(string, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == string) {
      return true;
    }
  }
  return false;
}

function formatLocation(string) {
  // Extract the coordinates using a regular expression
  console.log(string);
  const coordPattern = /.*?([-\d.]+).*?([-\d.]+).*?([-\d.]+)/;
  const match = string.match(coordPattern);

  if (match && match.length === 4) {
    // Parse the strings to float and round them
    const x = Math.round(parseFloat(match[1]));
    const y = Math.round(parseFloat(match[2]));
    const z = Math.round(parseFloat(match[3]));

    // Return the coordinates in the desired format
    return `${x}, ${y}, ${z}`;
  } else {
    // Return an error message if the format does not match
    return "Invalid format";
  }
}

function finishBounty(event) {
  let sPData = event.server.persistentData;
  sPData.bounty.finished++;

  //Recalculate rewards
  sPData.bounty.rewardAmount = generateAmount(sPData.bounty.finished);
  sPData.bounty.reward = generateReward(sPData.bounty.finished);

  sPData.bounty.timer = sPData.bounty.timeToChange * 2;
  log(event, "Timer: " + sPData.bounty.timer);

  event.server.runCommandSilent(
    `/effect clear ${sPData.bounty.target} minecraft:glowing`,
  );

  let blacklist = sPData.bounty.blacklist;

  let isInBlacklist = isIncluded(sPData.bounty.target, blacklist);

  log(
    event,
    (!isInBlacklist ? "adding " : "doing nothing for ") +
      sPData.bounty.target +
      " to blacklist",
  );

  if (!isInBlacklist) blacklist.push(sPData.bounty.target);

  sPData.bounty.target = null;
  sPData.bounty.hasAnnouncedDelay = false;
}

function stringifyItem(item) {
  return Item.of(item).displayName.getString().slice(1, -1);
}

function sendGlobalMessage(event, title, subtitle) {
  //SEND HERE
  event.server.runCommandSilent(`/title @a times 20 100 20`);
  event.server.runCommandSilent(
    `/title @a title {"text":"${title}", "bold": true, "color": "yellow"}`,
  );
  event.server.runCommandSilent(
    `/title @a subtitle {"text":"${subtitle}", "italic": true }`,
  );
}

const dimensionMap = {
  "minecraft:overworld": "Overworld",
  "minecraft:the_nether": "Nether",
  "minecraft:the_end": "End",
  "aether:the_aether": "Aether",
  "voidscape:void": "Void",
};

const minPlayers = 2; //TODO: CHANGE TO 4

function checkBountyAvailability(event) {
  let sPData = event.server.persistentData;
  sPData.bounty.enabled =
    sPData.bounty.enabled ?? event.server.players.length >= minPlayers;
}

PlayerEvents.loggedIn((event) => {
  checkBountyAvailability(event);
  let sPData = event.server.persistentData;
  sPData.bounty.stats[event.player.username] = {
    death: 0,
    survived: 0,
    kills: {},
  };

  sPData.optOutStatuses[event.player.username] =
    sPData.optOutStatuses[event.player.username] ?? false;
});

PlayerEvents.loggedOut((event) => {
  checkBountyAvailability(event);
});

// Initialize or retrieve persistent opt-out status storage
function initializeOptOutStatus(sPData) {
  if (!sPData.optOutStatuses) {
    sPData.optOutStatuses = {};
  }
}

ServerEvents.loaded((event) => {
  let sPData = event.server.persistentData;
  initializeOptOutStatus(sPData);
});

function optInPlayer(event) {
  let player = event.player.username;
  let sPData = event.server.persistentData;
  // Update opt-out status storage
  sPData.optOutStatuses[player] = false;

  let blacklist = sPData.bounty.blacklist;

  if (isIncluded(player, blacklist)) {
    blacklist.splice(blacklist.indexOf(player), 1);
  }

  event.player.tell("§aYou have opted in to the bounty system.");
}

function optOutPlayer(event) {
  let sPData = event.server.persistentData;

  if (sPData.bounty.target) {
    event.player.tell("§cYou cannot opt out while a bounty is active.");
    return;
  }

  let player = event.player.username;
  // Update opt-out status storage
  sPData.optOutStatuses[player] = true;
  event.player.tell("§cYou have opted out of the bounty system.");
}

function eligibleForBounty(playerUsername, sPData) {
  // Check if player has opted out
  return !sPData.optOutStatuses[playerUsername];
}

ServerEvents.tick((event) => {
  let sPData = event.server.persistentData;

  sPData.bounty = sPData.bounty ?? {};

  let bounty = sPData.bounty;

  bounty.override = bounty.override ?? true;

  bounty.timeToChange = 20 * 30; // 20 ticks * X seconds * X minutes //TODO: change to 1 hour

  bounty.enabled = bounty.enabled ?? event.server.players.length >= minPlayers;

  bounty.stats = bounty.stats ?? {};

  bounty.reward = bounty.reward ?? generateReward(bounty.finished);
  bounty.rewardAmount = bounty.rewardAmount ?? generateAmount(bounty.finished);
  bounty.timer = bounty.timer ?? 0;

  bounty.blacklist = bounty.blacklist ?? [];

  bounty.target = bounty.target ?? null;
  bounty.lastSeen = bounty.lastSeen ?? "";

  bounty.finished = bounty.finished ?? 0;
  bounty.timer--;

  bounty.stats = bounty.stats ?? {};

  bounty.hasAnnouncedDelay = bounty.hasAnnouncedDelay ?? false;

  if (bounty.timer == (20 * 30) && !bounty.hasAnnouncedDelay) {
    //TODO: change to 5 minutes
    bounty.hasAnnouncedDelay = true;

    let eligiblePlayers = event.server.players.filter((player) =>
      eligibleForBounty(player.username, sPData),
    );

    if (eligiblePlayers.length >= minPlayers) {
      sendGlobalMessage(
        event,
        "New bounty soon!",
        "You can opt in or opt out of the next bounty. Type !help.",
      );
    }
  }

  if (bounty.timer <= 0) {
    bounty.timer = 0;

    if (bounty.override) {
      return;
    }

    if (bounty.target !== null) {
      // IF SURVIVED
      let playerSurvived = event.server.getPlayer(bounty.target);
      if (playerSurvived !== null) {
        let survivorReward = (bounty.rewardAmount * 1.3).toFixed(0);

        if (!bounty.stats[bounty.target]) {
          // Initialize stats for the target player if not present
          bounty.stats[bounty.target] = { survived: 0, kills: {}, death: 0 };
        }
        // Add survive stat
        bounty.stats[bounty.target]["survived"]++;

        sendGlobalMessage(
          event,
          `${bounty.target} survived!`,
          `${bounty.target} has been rewarded ${survivorReward}x ${stringifyItem(bounty.reward)}`,
        );
        event.server.tell(
          `${bounty.target} survived! Rewarded with ${survivorReward}x ${stringifyItem(bounty.reward)}`,
        );

        playerSurvived.block.popItem(
          Item.of(bounty.reward).withCount(bounty.rewardAmount * 1.3),
        );
        playerSurvived = null;
      }
      finishBounty(event);
      return;
    }

    let eligiblePlayers = event.server.players.filter((player) =>
      eligibleForBounty(player.username, sPData),
    );

    if (eligiblePlayers.length >= minPlayers) {
      // IF AFTER BREAK

      // Only randomize from players that's not blacklisted
      let playersNotBlacklisted = eligiblePlayers.filter(
        (player) => !isIncluded(player.username, bounty.blacklist),
      );

      let targetPlayer = null;

      if (playersNotBlacklisted.length > 0) {
        targetPlayer =
          playersNotBlacklisted[
            Math.floor(Math.random() * playersNotBlacklisted.length)
          ];
      } else {
        bounty.blacklist = [];
        targetPlayer =
          eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
      }

      bounty.target = targetPlayer.username;
      event.server.runCommandSilent(
        `/effect give ${bounty.target} minecraft:glowing infinite`,
      );

      // ANNOUNCE MESSAGE
      let hasSent = false;
      if (!hasSent) {
        hasSent = true;

        sendGlobalMessage(
          event,
          `Wanted: ${bounty.target}`,
          `Reward: ${bounty.rewardAmount}x ${stringifyItem(bounty.reward)}`,
        );
        event.server.tell("§c"); // Red text color for separator lines
        event.server.tell("§c⚔ §6§lBounty Alert §c⚔"); // Gold and bold for title with red swords
        event.server.tell("§7"); // Gray for a separator line
        event.server.tell(
          "§eAttention, hunters! A new bounty has been issued!",
        ); // Yellow for attention
        event.server.tell("§7"); // Gray for a separator line

        let targetName = bounty.target;
        let location = formatLocation(
          event.server.getPlayer(targetName).position().toString(),
        );
        let dimension =
          dimensionMap[event.server.getPlayer(targetName).level.dimension];
        bounty.lastSeen = location + " in " + dimension;

        event.server.tell("§aTarget: §f" + targetName); // Green for "Target:" and white for the target's name

        event.server.tell("§bLocation: §f" + location + " in " + dimension); // Aqua for "Location:" and white for the location

        let rewardText = stringifyItem(bounty.reward);
        event.server.tell(
          "§6Reward: §e" + `x${bounty.rewardAmount} ${rewardText}`,
        ); // Gold for "Reward:" and yellow for the reward details

        event.server.tell("§7"); // Gray for a separator line
      }

      // SET TIMER
      bounty.timer = bounty.timeToChange;
    }
  }

  if (bounty.timer % (20 * 10) === 0 && !bounty.override) {
    // every 10 s
    if (bounty.target !== null) {
      event.server.tell(
        `${bounty.timer / 20} seconds left to kill ${bounty.target}`, //TODO: Change to minutes
      );
    }
  }
});

PlayerEvents.respawned((event) => {
  if (event.server.persistentData.bounty.target === event.player.username) {
    event.server.runCommandSilent(
      `/effect give ${event.player.username} minecraft:glowing infinite`,
    );
  }
});

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function announceBountyKill(event, killer, victim) {
  const verbs = [
    "smashed",
    "nuked",
    "pulverized",
    "dispatched",
    "wrecked",
    "creeped",
    "destroyed",
    "f**ked",
  ];
  const subtitles = [
    "Who needs a sword when you have " + killer + "?",
    "Looks like " + victim + " just got their blocks knocked off!",
    killer + " showed no mercy. PvP legend!",
    "Did anyone get the license plate of that Piglin?",
    victim + " tried to swim in lava to escape.",
    "Not even a Potion of Healing could save " + victim + ".",
    "Is it a bird? Is it a plane? No, it's " + killer + "'s victory!",
    victim + " forgot to set their spawn point. Ouch!",
    "Maybe " + victim + " will respawn with better luck.",
    "Looks like " + victim + " hit the ground too hard.",
  ];

  // Randomize the elements
  const verb = getRandomElement(verbs);
  const subtitle = getRandomElement(subtitles);

  // Create the announcement
  const announcementTitle = `§a${killer} §l§f⚔ §c${victim}!`;

  // Create the announcement
  const announcementTitle2 = `§6§lBounty Claimed: §e${killer} ${verb} ${victim}!`;
  const announcementSubtitle = `§7${subtitle}`;

  // Send the global message
  event.server.tell(announcementTitle2);
  event.server.tell(announcementSubtitle);

  sendGlobalMessage(event, announcementTitle, subtitle);
}

EntityEvents.death((event) => {
  let victim = event.player;
  let suspect = event.source.player;

  if (victim.isPlayer() && suspect.isPlayer()) {
    if (victim.username === suspect.username) return;

    let sPData = event.server.persistentData;
    let bounty = sPData.bounty;

    let isBountyKill = bounty.target === victim.username;

    if (isBountyKill) {
      announceBountyKill(event, suspect.username, victim.username);

      let playerHead = Item.playerHead(victim.username);

      suspect.tell("Your reward will be dropped in 5 seconds.");
      event.server.scheduleInTicks(20 * 5, () => {
        suspect.tell("§aYour reward has been dropped.");
        suspect.block.popItem(playerHead);
        suspect.block.popItem(Item.of(bounty.reward, bounty.rewardAmount));
      });

      if (!bounty.stats[suspect.username]) {
        bounty.stats[suspect.username] = { survived: 0, kills: {}, death: 0 };
      }

      if (!bounty.stats[victim.username]) {
        bounty.stats[victim.username] = { survived: 0, kills: {}, death: 0 };
      }

      // add kill stat
      bounty.stats[suspect.username]["kills"][victim.username]
        ? bounty.stats[suspect.username]["kills"][victim.username]++
        : (bounty.stats[suspect.username]["kills"][victim.username] = 1);
      bounty.stats[victim.username]["death"]++;

      //Reset timer
      finishBounty(event);
    }
  }
});

BlockEvents.rightClicked("minecraft:crafting_table", (event) => {
  //TODO: change to waystone
  let player = event.player.username;
  let target = event.server.persistentData.bounty.target;
  if (target === player) {
    event.player.tell(
      "§cYou cannot use a waystone when you're being targeted.",
    );
    event.cancel();
  }
});

PlayerEvents.chat((event) => {
  if (event.message.trim().toLowerCase() == "!help") {
    event.player.tell("§6§lCommands:");
    event.player.tell("");
    event.player.tell("§e!bounty §f- Shows the current bounty details.");
    event.player.tell("§e!stats §f- Shows your bounty stats.");
    event.player.tell("§e!lb §f- Shows the leaderboard.");
    event.player.tell(
      "§e!join §f- Opt in to the bounty system. On by default.",
    );
    event.player.tell("§e!leave §f- Opt out of the bounty system.");
    event.cancel();
  }

  let sPData = event.server.persistentData;

  if (event.message.trim().toLowerCase() == "!bounty") {
    let sPData = event.server.persistentData;
    let bounty = sPData.bounty;

    // Check if there's an active bounty
    if (bounty && bounty.target) {
      let targetName = bounty.target;
      let lastSeen = bounty.lastSeen;

      // Send information to the player who asked for it
      event.player.tell("§6§lCurrent Bounty Target:");
      event.player.tell("");
      event.player.tell("§eTarget: §f" + targetName);
      event.player.tell("§eLast seen: §f" + lastSeen);
      event.player.tell("§eTime left: §f" + bounty.timer / 20 + "s"); //TODO: to minutes
    } else if (bounty.override) {
      event.player.tell("§cBounty is disabled.");
    } else {
      // Inform the player that there is no active bounty
      event.player.tell(
        `§cThere is currently no active bounty. Next bounty in ${bounty.timer / 20} seconds.`, //TODO: to minutes
      );
    }
    event.player.tell("");
    let eligiblePlayers = event.server.players.filter((player) => {
      return eligibleForBounty(player.username, sPData);
    });
    event.player.tell(
      `§fCurrent Players: ${eligiblePlayers.map((player) => player.username).join(", ")}`,
    );
    event.cancel();
  }

  if (event.message.trim().toLowerCase() == "!bounty override") {
    sPData.bounty.override = !sPData.bounty.override;
    event.cancel();
  }

  if (event.message.trim().toLowerCase() == "!bounty data") {
    Object.entries(sPData.bounty).forEach((entry) => {
      const [key, value] = entry;
      event.player.tell(`${key}: ${value}`);
    });
    event.cancel();
  }

  if (event.message.trim().toLowerCase() == "!bounty join") {
    event.player.tell(sPData.bounty.toString());
  }

  if (event.message.trim().toLowerCase() == "!bounty leave") {
    event.player.tell(sPData.bounty.toString());
  }

  if (event.message.trim().toLowerCase() == "!bounty time") {
    sPData.bounty.timer = 20;
    event.cancel();
  }

  if (event.message.trim().toLowerCase() == "!bounty clear") {
    sPData.bounty.target = null;
    sPData.bounty.timer = 20;
    sPData.bounty.reward = generateReward(sPData.bounty.finished);
    sPData.bounty.rewardAmount = generateAmount(sPData.bounty.finished);
    sPData.bounty.stats = {};
    event.cancel();
  }

  if (event.message.trim().toLowerCase() == "!stats clear") {
    sPData.bounty.finished = 0;
    sPData.bounty.stats = {};
    event.cancel();
  }

  if (event.message.trim().toLowerCase() == "!stats") {
    let player = event.player.username;
    let stats = sPData.bounty.stats[player];

    let death = stats.death;
    let survived = stats.survived;
    let killsObject = stats.kills;
    let totalKills = Object.values(killsObject).reduce(
      (acc, currentValue) => acc + currentValue,
      0,
    );

    event.player.tell("");
    event.player.tell("§lYour stats");
    event.player.tell("");
    event.player.tell([
      Text.aqua("Kills"),
      Text.white(": "),
      Text.white(totalKills),
    ]);
    event.player.tell([
      Text.red("Deaths"),
      Text.white(": "),
      Text.white(death),
    ]);
    event.player.tell([
      Text.green("Survived"),
      Text.white(": "),
      Text.white(survived),
    ]);
    event.cancel();
  }

  if (event.message.trim().toLowerCase() == "!lb") {
    let sPData = event.server.persistentData;
    displayLeaderboard(event, sPData.bounty.stats);
    event.cancel();
  }

  let message = event.message.trim().toLowerCase();

  switch (message) {
    case "!join":
      optInPlayer(event);
      event.cancel();
      break;
    case "!leave":
      optOutPlayer(event);
      event.cancel();
      break;
    case "!init":
      initializeOptOutStatus(sPData);
      event.cancel();
      break;
    case "creeper":
      event.server.scheduleInTicks(5, (ctx) => {
        event.server.tell("Aww man!");
      });
      break;
  }
});

function calculateKD(stats) {
  let kdList = [];

  for (var player in stats) {
    var playerStats = stats[player];
    // Calculate total kills
    var totalKills = Object.values(playerStats.kills).reduce(
      (acc, currentValue) => acc + currentValue,
      0,
    );
    var deaths = playerStats.death;

    // Avoid division by zero by setting a minimum death count of 1
    var kdRatio = totalKills / (deaths === 0 ? 1 : deaths);

    var survived = playerStats.survived;

    kdList.push({
      player: player,
      kdRatio: kdRatio,
      totalKills: totalKills,
      deaths: deaths,
      survived: survived,
    });
  }

  // Sort the list by K/D ratio in descending order
  kdList.sort((a, b) => b.kdRatio - a.kdRatio);

  return kdList;
}

function displayLeaderboard(event, stats) {
  const kdList = calculateKD(stats);

  event.server.tell(" ");
  event.server.tell("§lChowkingdom Bounty Leaderboard"); // Gold color with bold formatting for title
  event.server.tell(" ");

  kdList.forEach((entry, index) => {
    let colorCode;
    // Assign color codes based on the player's position
    if (index === 0) {
      colorCode = "§6"; // Gold for first place
    } else if (index === 1) {
      colorCode = "§a"; // Green for second place
    } else if (index === 2) {
      colorCode = "§f"; // White for third place
    } else {
      colorCode = "§7"; // Gray for the others
    }

    event.server.tell(
      `${colorCode}${index + 1}. ${entry.player} - K/D: ${entry.kdRatio.toFixed(2)}, Kills: ${entry.totalKills}, Deaths: ${entry.deaths}, Times Survived: ${entry.survived}`,
    );
  });
}

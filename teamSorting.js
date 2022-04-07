function sortTeams(message) {
  const currentActiveUsers = getActiveUsers(message);
  const teamSize = Math.ceil(currentActiveUsers.length / 2);
  var teams = { team1: [], team2: [] };

  //Sort random teams
  currentActiveUsers.map((user) => {
    if (!Math.floor(Math.random() * 2)) {
        switch(isFull(teams.team1, teamSize)){
            case true:
                teams.team2.push(user);
                break;
            case false:
                teams.team1.push(user);
                break;
        }
    } else {
        switch(isFull(teams.team2, teamSize)){
            case true:
                teams.team1.push(user);
                break;
            case false:
                teams.team2.push(user);
                break;
        }
    }
  });

  console.log(teams);
}

function isFull(team, maxSize) {
  if (team.length >= maxSize) {
    return true;
  } else {
    return false;
  }
}

function getActiveUsers(message) {
  const voiceChannels = message.channel.guild.channels.cache.filter(
    (channel) => channel.type === "voice"
  );

  const activeUsers = [];
  voiceChannels.map((vc) => {
    if (vc.members.size > 0) {
      vc.members.map((member) => {
        activeUsers.push({ name: member.user.username, id: member.user.id });
      });
    }
  });
  return activeUsers;
}

module.exports = {
  sortTeams: (message) => sortTeams(message),
};

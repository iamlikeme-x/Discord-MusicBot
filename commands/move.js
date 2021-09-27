const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const play = require("./play");

  module.exports = {
    name: "move",
    description: `Move a song in the queue`,
    usage: "[from] [to]",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["m"],

    /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.players.get(message.guild.id);
    if (!player) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **You must be in a voice channel to use this command!**");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **You must be in the same voice channel as me to use this command!**");
        
    if (!player.queue || !player.queue.length || player.queue.length <= 1) {
       return message.channel.send("There aren't enough tracks in the queue to move");
    }
    let from = Number(args[0]);
    let to   = Number(args[1]);

    let error = false;
    let move = new MessageEmbed()
      .setDescription(`✅ **|** Moved track **\`${from}\`** to position **\`${to}\`** !`)
      .setColor("GREEN")


    if (isNaN(from) || isNaN(to)) {
      error = true;
      move.setDescription(`**Usage - **\`${client.botconfig.prefix}move [from] [to]\``);
    }

    if (from > player.queue.length || to > player.queue.length) {
      error = true;
      move.setDescription(`The queue has only ${player.queue.length} songs!`);
    }

    if (from == to) {
      error = true;
      move.setDescription(`From and to cannot be the same!`);
    }

    if (error) {
      move.setColor("RED");
      await message.channel.send(move);
      return;
    }

    // Dehumanize numbers
    from = from - 1;
    to   = to   - 1;

    let song = player.queue.remove(from);
    player.queue.add(song, to);
    await message.channel.send(move);
  },

  SlashCommand: {
    options: [
      {
          name: "from",
          value: "[track]",
          type: 4,
          required: true,
          description: "Track to move",
      },
      {
          name: "to",
          value: "[track]",
          type: 4,
          required: true,
          description: "Position to move to",
      },
  ],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {object[]} args
   * @param {*} param3
   */
    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      if (!player) return client.sendTime(interaction, "❌ | **Nothing is playing right now...**");
      if (!member.voice.channel) return client.sendTime(interaction, "❌ | **You must be in a voice channel to use this command.**");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **You must be in the same voice channel as me to use this command!**");
        
      if (!player.queue || !player.queue.length || player.queue.length <= 1) {
         return message.channel.send("There aren't enough tracks in the queue to move");
      }

      let from = Number(args[0].value);
      let to   = Number(args[1].value);

      let error = false;
      let move = new MessageEmbed()
        .setDescription(`✅ **|** Moved track **\`${from}\`** to position **\`${to}\`** !`)
        .setColor("GREEN")

  
      if (isNaN(from) || isNaN(to)) {
        error = true;
        move.setDescription(`**Usage - **\`${client.botconfig.prefix}move [from] [to]\``);
      }
  
      if (from > player.queue.length || to > player.queue.length) {
        error = true;
        move.setDescription(`The queue has only ${player.queue.length} songs!`);
      }
  
      if (from == to) {
        error = true;
        move.setDescription(`From and to cannot be the same!`);
      }

      if (error) {
        move.setColor("RED");
        await interaction.send(move);
        return;
      }
  
      // Dehumanize numbers
      from = from - 1;
      to   = to   - 1;
  
      let song = player.queue.remove(from);
      player.queue.add(song, to);
      await interaction.send(move);
    },
  }
};

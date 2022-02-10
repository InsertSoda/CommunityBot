import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import { userUtils } from '@utils/userUtils'
import { dateUtils } from '@utils/dateUtils.js'

export async function guild (message: Message, args: string[]): Promise<Message<boolean>> {
  const guildID = parseInt(args[0])

  const response = await axios.get('https://api.polytoria.com/v1/guild/info', { params: { id: guildID }, validateStatus: () => true })
  const data = response.data

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const userData = await userUtils.getUserData(data.CreatorID)

  const Embed = new MessageEmbed({
    title: data.Name,
    description: data.Description,
    url: 'https://polytoria.com/guilds/' + data.ID.toString(),
    thumbnail: {
      url: data.Thumbnail
    },
    color: '#ff5454',
    fields: [
      {
        name: '🗂️ Creator ID 🗂️',
        value: data.CreatorID.toString(),
        inline: true
      },
      {
        name: '👷 Creator Name 👷',
        value: userData.Username,
        inline: true
      },
      {
        name: '🎉 Members 🎉',
        value: data.Members.toLocaleString(),
        inline: true
      },
      {
        name: '✅ Is Verified ✅',
        value: data.IsVerified.toString(),
        inline: true
      },
      {
        name: '🔥 Created At 🔥',
        value: dateUtils.atomTimeToDisplayTime(data.CreatedAt),
        inline: true
      }
    ]
  })

  return message.channel.send({
    embeds: [Embed]
  })
}
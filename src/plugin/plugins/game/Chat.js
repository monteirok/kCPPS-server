import GamePlugin from '@plugin/GamePlugin'

import { hasProps, isNumber, isString, isLength } from '@utils/validation'


export default class Chat extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'send_message': this.sendMessage,
            'send_safe': this.sendSafe,
            'send_emote': this.sendEmote
        }

        this.commands = {
            'ai': this.addItem,
            'aa': this.addAll,
            'af': this.addFurniture,
            'ac': this.addCoins,
            'nick': this.changeNickname,
            'jr': this.joinRoom,
            'users': this.userPopulation,
            'alert': this.alert,
            'help': this.help,
            'ng': this.setNameglow,
            'nc': this.setNamecolor,
            'head': this.setHead,
            'face': this.setFace,
            'neck': this.setNeck,
            'body': this.setBody,
            'hand': this.setHand,
            'feet': this.setFeet,
            'bg': this.setBackground,
            'pin': this.setPin
        }

        this.bindCommands()

        this.messageRegex = /[^ -~]/i
        this.maxMessageLength = 48
    }

    // Events

    sendMessage(args, user) {
        if (!hasProps(args, 'message')) {
            return
        }

        if (!isString(args.message)) {
            return
        }

        if (this.messageRegex.test(args.message)) {
            return
        }

        // Remove extra whitespace
        args.message = args.message.replace(/  +/g, ' ').trim()

        if (!isLength(args.message, 1, this.maxMessageLength)) {
            return
        }

        if (args.message.startsWith('!') && this.processCommand(args.message, user)) {
            return
        }
        else if (args.message.startsWith('!') && !(this.processCommand(args.message, user))) {
            user.send('error', { error: 'Invalid command. Try !help for more.' })
        }

        user.room.send(user, 'send_message', { id: user.data.id, message: args.message }, [user], true)
    }

    sendSafe(args, user) {
        if (!hasProps(args, 'safe')) {
            return
        }

        if (!isNumber(args.safe)) {
            return
        }

        user.room.send(user, 'send_safe', { id: user.data.id, safe: args.safe }, [user], true)
    }

    sendEmote(args, user) {
        if (!hasProps(args, 'emote')) {
            return
        }

        if (!isNumber(args.emote)) {
            return
        }

        user.room.send(user, 'send_emote', { id: user.data.id, emote: args.emote }, [user], true)
    }

    // Commands

    bindCommands() {
        for (let command in this.commands) {
            this.commands[command] = this.commands[command].bind(this)
        }
    }

    processCommand(message, user) {
        message = message.substring(1)

        let args = message.split(' ')
        let command = args.shift().toLowerCase()

        if (command in this.commands) {
            this.commands[command](args, user)
            return true
        }

        return false
    }

    addItem(args, user) {
        if (user.isModerator) {
            this.plugins.item.addItem({ item: args[0] }, user)
        }
    }

    addAll(args, user) {
        if (user.isModerator) {
            this.plugins.item.addAll({ item: args[0] }, user)
        }
    }

    addFurniture(args, user) {
        if (user.isModerator) {
            this.plugins.igloo.addFurniture({ furniture: args[0] }, user)
        }
    }

    addCoins(args, user) {
        if (user.isModerator) {
            user.updateCoins(args[0], true)
        }
    }

    changeNickname(args, user) {
        if (user.isModerator) {
            if (args[0] == undefined || args[0] == "") {
                user.send('error', { error: `Invalid nickname.` })
            }
            else {
                let nick = Array.prototype.slice.call(args).join(" ")

                user.updateNickname(nick)

                let roomUser = user.room.id
                let roomLoad = 42069
                this.plugins.join.joinRoom({ room: roomLoad }, user)
                this.plugins.join.joinRoom({ room: roomUser }, user)
            }n
        }n
    }

    joinRoom(args, user) {
        if (user.isModerator) {
            this.plugins.join.joinRoom({ room: args[0] }, user)
        }
    }

    userPopulation(args, user) {
        user.send('error', { error: `Users online: ${this.handler.population}` })
    }

    alert(args, user) {
        if (user.isModerator) {
            let message = Array.prototype.slice.call(args).join(" ")

            user.room.send(user, 'error', { error: message }, [user], false)
            user.send('error', { error: message })
        }
    }

    help(args, user) {
        if (user.isModerator) { 
            let message = "COMMANDS:\n-------------------\n!ai  !aa\n!af  !ac\n!nick  !jr\n!users  !alert\n!ng  !nc\n!head  !face\n!neck  !body\n!hand  !feet\n!bg  !pin"

            user.room.send(user, 'error', { error: message }, [user], false)
            user.send('error', { error: message })
        }
    }

    setNameglow(args, user) {
        if (user.isModerator) {
            user.updateNameglow(args)

            let roomUser = user.room.id
            let roomLoad = 42069
            this.plugins.join.joinRoom({ room: roomLoad }, user)
            this.plugins.join.joinRoom({ room: roomUser }, user)
        }
    }

    setNamecolor(args, user) {
        if (user.isModerator) {
            user.updateNamecolor(args)

            let roomUser = user.room.id
            let roomLoad = 42069
            this.plugins.join.joinRoom({ room: roomLoad }, user)
            this.plugins.join.joinRoom({ room: roomUser }, user)
        }
    }

    setHead(args, user) {
        if (user.isModerator) {
            user.updateHead(args)

            let roomUser = user.room.id
            let roomLoad = 42069
            this.plugins.join.joinRoom({ room: roomLoad }, user)
            this.plugins.join.joinRoom({ room: roomUser }, user)
        }
    }

    setFace(args, user) {
        if (user.isModerator) {
            user.updateFace(args)

            let roomUser = user.room.id
            let roomLoad = 42069
            this.plugins.join.joinRoom({ room: roomLoad }, user)
            this.plugins.join.joinRoom({ room: roomUser }, user)
        }
    }
    
    setNeck(args, user) {
        if (user.isModerator) {
            user.updateNeck(args)

            let roomUser = user.room.id
            let roomLoad = 42069
            this.plugins.join.joinRoom({ room: roomLoad }, user)
            this.plugins.join.joinRoom({ room: roomUser }, user)
        }
    }

    setBody(args, user) {
        if (user.isModerator) {
            user.updateBody(args)

            let roomUser = user.room.id
            let roomLoad = 42069
            this.plugins.join.joinRoom({ room: roomLoad }, user)
            this.plugins.join.joinRoom({ room: roomUser }, user)
        }
    }

    setHand(args, user) {
        if (user.isModerator) {
            user.updateHand(args)

            let roomUser = user.room.id
            let roomLoad = 42069
            this.plugins.join.joinRoom({ room: roomLoad }, user)
            this.plugins.join.joinRoom({ room: roomUser }, user)
        }
    }

    setFeet(args, user) {
        if (user.isModerator) {
            user.updateFeet(args)

            let roomUser = user.room.id
            let roomLoad = 42069
            this.plugins.join.joinRoom({ room: roomLoad }, user)
            this.plugins.join.joinRoom({ room: roomUser }, user)
        }
    }

    setBackground(args, user) {
        if (user.isModerator) {
            user.updatePhoto(args)

            let roomUser = user.room.id
            let roomLoad = 42069
            this.plugins.join.joinRoom({ room: roomLoad }, user)
            this.plugins.join.joinRoom({ room: roomUser }, user)
        }
    }

    setPin(args, user) {
        if (user.isModerator) {
            user.updateFlag(args)

            let roomUser = user.room.id
            let roomLoad = 42069
            this.plugins.join.joinRoom({ room: roomLoad }, user)
            this.plugins.join.joinRoom({ room: roomUser }, user)
        }
    }

}

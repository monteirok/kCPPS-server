import Buddy from './Buddy'
import FurnitureInventory from './FurnitureInventory'
import IglooInventory from './IglooInventory'
import Ignore from './Ignore'
import Inventory from './Inventory'
import PurchaseValidator from './PurchaseValidator'

import { isInRange } from '@utils/validation'


export default class User {

    constructor(socket, handler) {
        this.socket = socket
        this.handler = handler
        this.db = handler.db

        this.address

        this.validatePurchase = new PurchaseValidator(this)

        this.data
        this.room
        this.x = 0
        this.y = 0
        this.frame = 1

        this.buddy
        this.ignore
        this.inventory

        this.minigameRoom

        // Game server authentication
        this.authenticated = false
        this.token = {}
    }

    get isModerator() {
        return this.data.rank > 2 /* changeId=2 */
    }

    get crumbs() {
        return this.handler.crumbs
    }

    async setBuddies(buddies) {
        this.buddy = new Buddy(this)
        await this.buddy.init(buddies)
    }

    async setIgnores(ignores) {
        this.ignore = new Ignore(this)
        await this.ignore.init(ignores)
    }

    setInventory(inventory) {
        this.inventory = new Inventory(this, inventory)
    }

    setIglooInventory(inventory) {
        this.iglooInventory = new IglooInventory(this, inventory)
    }

    setFurnitureInventory(inventory) {
        this.furnitureInventory = new FurnitureInventory(this, inventory)
    }

    setItem(slot, item) {
        if (this.data[slot] == item) {
            return
        }

        this.data[slot] = item
        this.room.send(this, 'update_player', { id: this.data.id, item: item, slot: slot }, [])

        this.update({ [slot]: item })
    }

    updateCoins(coins, gameOver = false) {
        coins = parseInt(coins)

        if (!isNaN(coins)) {
            this.data.coins = Math.max(Math.min(1000000000, this.data.coins + coins), 0)

            this.update({ coins: this.data.coins })
        }

        if (gameOver) {
            this.send('game_over', { coins: this.data.coins })
        }
    }

    updateNickname(newname) {
        this.data.nickname = newname
        this.update({ nickname: this.data.nickname })
    }

    updateNameglow(newglow) {
        this.data.nameglow = newglow
        this.update({ nameglow: this.data.nameglow })
    }

    updateNamecolor(newcolor) {
        this.data.namecolor = newcolor
        this.update({ namecolor: this.data.namecolor })
    }

    updateHead(newhead) {
        this.data.head = newhead
        this.update({ head: this.data.head })
    }

    updateFace(newface) {
        this.data.face = newface
        this.update({ head: this.data.face })
    }

    updateNeck(newneck) {
        this.data.neck = newneck
        this.update({ neck: this.data.neck })
    }

    updateBody(newbody) {
        this.data.body = newbody
        this.update({ body: this.data.body })
    }

    updateHand(newhand) {
        this.data.hand = newhand
        this.update({ hand: this.data.hand })
    }

    updateFeet(newfeet) {
        this.data.feet = newfeet
        this.update({ feet: this.data.feet })
    }

    updatePhoto(newphoto) {
        this.data.photo = newphoto
        this.update({ photo: this.data.photo })
    }

    updateFlag(newflag) {
        this.data.flag = newflag
        this.update({ flag: this.data.flag })
    }

    joinRoom(room, x = 0, y = 0) {
        if (!room || room === this.room || this.minigameRoom) {
            return
        }

        if (room.isFull) {
            return this.send('error', { error: 'Sorry this room is currently full' })
        }

        if (!isInRange(x, 0, 1520)) {
            x = 0
        }

        if (!isInRange(y, 0, 960)) {
            y = 0
        }

        this.room.remove(this)

        this.room = room
        this.x = x
        this.y = y
        this.frame = 1

        this.room.add(this)
    }

    joinTable(table) {
        if (table && !this.minigameRoom) {
            this.minigameRoom = table

            this.minigameRoom.add(this)
        }
    }

    update(query) {
        this.db.users.update(query, { where: { id: this.data.id }})
    }

    send(action, args = {}) {
        this.socket.emit('message', { action: action, args: args })
    }

    close() {
        this.socket.disconnect(true)
    }

    get string() {
        return {
            id: this.data.id,
            username: this.data.username,
            /** changeId=1 start */
            nickname: this.data.nickname,
            /** changeId=1 end */
            nameglow: this.data.nameglow,
            namecolor: this.data.namecolor,
            color: this.data.color,
            head: this.data.head,
            face: this.data.face,
            neck: this.data.neck,
            body: this.data.body,
            hand: this.data.hand,
            feet: this.data.feet,
            flag: this.data.flag,
            photo: this.data.photo,
            coins: this.data.coins,
            x: this.x,
            y: this.y,
            frame: this.frame,
            rank: this.data.rank,
            joinTime: this.data.joinTime
        }
    }

}

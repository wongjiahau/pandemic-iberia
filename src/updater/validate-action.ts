import { Game } from "../model/game";
import { Action } from "../model/action";

export const validateAction = ({
  game,
  action
}: {
  game: Game,
  action: Action
}): {
  type: 'ok'
} | {
  type: 'fail'
  message: string
} => {

}
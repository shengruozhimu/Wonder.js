/// <reference path="../../definitions.d.ts"/>
module dy {
    export class Spawn extends Control{
        public static create() {
            var spawn = null;

            dyCb.Log.assert(arguments.length >= 2, "应该有2个及以上动作");

            spawn = new this(Array.prototype.slice.call(arguments, 0));

            return spawn;
        }

        constructor(actionArr:Array<Action>){
            super();

            this._actions.addChildren(actionArr);
        }

        private _actions:dyCb.Collection<Action> = dyCb.Collection.create<Action>();

        public update(time) {
            if (this._isFinish()) {
                this.finish();
                return;
            }

            this.iterate("update", [time]);
        }

        public start() {
            super.start();

            this.iterate("start");

            return this;
        }

        public copy() {
            var actions = [];

            this._actions.forEach(function (action) {
                actions.push(action.copy());
            });
            return Spawn.create.apply(Spawn, actions);
        }

        public stop() {
            super.stop();

            this.iterate("stop");

            return this;
        }

        public getInnerActions() {
            return this._actions;
        }

        protected iterate(method:string, argArr?:Array<any>) {
            this._actions.forEach((action:Action) => {
                action[method].apply(action, argArr);
            });
        }

        private _isFinish() {
            var isFinish = true;

            this._actions.forEach((action:Action) => {
                if (!action.isFinish) {
                    isFinish = false;
                    return dyCb.$BREAK;
                }
            });

            return isFinish;
        }
    }
}


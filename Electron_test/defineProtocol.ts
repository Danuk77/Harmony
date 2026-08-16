
// Harmony api ===============================================
// all these functions should have actual definitions, I'm just learning how to make types here OK??

type AlertFunction = {
    // The output is typed as one of the items in `selections`
    // https://dev.to/captainyossarian/typescript-type-inference-on-function-arguments-2n93
    <Value extends string, T extends Value[]>(text: string, selections?:T): Promise<T[number] | undefined>
}

type AppendMessageFunction = {
    (sender:string, message:string): any
}


type DisplayRightClickMenu = {
    <Value extends string, T extends Value[]>(items: T): Promise<T[number]|undefined>
}

type HarmonyAPI = {
    hAlert: AlertFunction,
    hAppendMessage: AppendMessageFunction,
    hDisplayRightClickMenu: DisplayRightClickMenu,
}


// defining of defineProtocol ======================================
// An interface where thet below functions are defined

type DefineProtocolOnStartup = {
    (api: HarmonyAPI): any
}

type DefineProtocolOnSendMessage = {
    (api: HarmonyAPI, recipient:string, message:string): boolean | Promise<boolean>
}

type DefineProtocolOnRightClickUser ={
    (api: HarmonyAPI, username: string): any
}

type DefineProtocolOptions = {
    name?:string,
    description?: string,
    onStartup?: DefineProtocolOnStartup,
    onSendMessage?: DefineProtocolOnSendMessage,
    onRightClickUser?: DefineProtocolOnRightClickUser
}

// don't stricty need this as you could just do `const myProtocol : DefineProtocolOptions = {...}`
// but whatever it's a bit nicer
function defineProtocol(options: DefineProtocolOptions) {
    return options;
}


// usage example ===========================================

export default defineProtocol({

    name: "Test protocol",
    description: "Fake protocol to test typescript stuff",

    onStartup: async ({ hAlert, hAppendMessage }) => {

        // all h[...] functions are part of the Harmony api and do something in the renderer
        await hAlert("Hello, you have started the initialization procedure for the protocl.");

        // do some stuff, like connect to the signalling server
        // ...


        // pretend onReceiveMessage is a real event handler
        const onReceiveMessage = ((sender, message) => {
            hAppendMessage(sender, message);
        })

    },

    onSendMessage: async ({hAlert}, recipient, message) => {

        // in vscode hover over confirmation; it is typed correctly! (wow!)
        const confirmation = await hAlert(`Wait, do you *actually* want to send the message "${message}" to "${recipient}"?`, ["Yes", "Actually no"]);

        if (confirmation == "Actually no" || !confirmation) {
            return false
        }

        // ...
        

        // the message was sent successfully
        return true        

    },

    onRightClickUser: async({hDisplayRightClickMenu}, username) => {
        
        const chosenOption = await hDisplayRightClickMenu(["Reconnect", "Delete user"]);

        switch (chosenOption) {
            case "Reconnect":
                // do some stuff
                // and maybe update the interface
                break;

            case "Delete user":
                // do some stuff
                // and maybe update the interface too
                break;
        }
    }

})

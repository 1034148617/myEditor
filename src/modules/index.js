import {Boot} from '@wangeditor/editor'
import dataHolderModule from "@/modules/data-holder"
import dynamicRowModule from "@/modules/dynamic-row"
import attachmentModule from "@/modules/attachment";
import documentModule from "@/modules/document";

Boot.registerModule(dataHolderModule)
Boot.registerModule(dynamicRowModule)
Boot.registerModule(attachmentModule)
Boot.registerModule(documentModule)




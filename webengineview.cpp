#include "webengineview.h"

#include <QWheelEvent>

WebEngineView::WebEngineView(JsContext*js,QObject*parent)
    :jsContext(js)
{

}

void WebEngineView::wheelEvent(QWheelEvent *event)
{
    if(event->delta() > 0){                    // 当滚轮远离使用者时
            jsContext->sendWheelEvent(this->page(),1);               // 进行放大
        }else{                                     // 当滚轮向使用者方向旋转时
            jsContext->sendWheelEvent(this->page(),2);        // 进行缩小
        }

}

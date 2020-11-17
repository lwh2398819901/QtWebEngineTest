#ifndef WEBENGINEVIEW_H
#define WEBENGINEVIEW_H

#include "jscontext.h"
#include <QWebEngineView>

class WebEngineView : public QWebEngineView
{
    Q_OBJECT
public:
    WebEngineView(JsContext*js,QObject*parent=nullptr);
protected:
    void wheelEvent(QWheelEvent *event);
private:
    JsContext*jsContext;
};

#endif // WEBENGINEVIEW_H

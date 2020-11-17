#include "jscontext.h"

JsContext::JsContext(QObject *parent)
{

}

void JsContext::sendMsg(QWebEnginePage* page, const QString& msg)
{
    page->runJavaScript(QString("recvMessage('%1');").arg(msg));
}

void JsContext::onMsg(const QString &msg)
{
    emit recvdMsg(msg);
}

void JsContext::onMsg2(int a, int b)
{
    qDebug()<<a<<b;
}

void JsContext::sendWheelEvent(QWebEnginePage* page, const int& type)
{
    page->runJavaScript(QString("recvMessage('%1');").arg(type));
}

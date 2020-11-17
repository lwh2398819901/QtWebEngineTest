#ifndef JSCONTEXT_H
#define JSCONTEXT_H

#include <QObject>
#include <QWebEnginePage>


class JsContext : public QObject
{
    Q_OBJECT
public:
    explicit JsContext(QObject *parent = nullptr);

signals:
    void recvdMsg(const QString& msg);

public:
    // 向页面发送消息
    void sendMsg(QWebEnginePage* page, const QString& msg);
    void sendWheelEvent(QWebEnginePage* page,const int& type);
public slots:
    // 接收到页面发送来的消息
    void onMsg(const QString& msg);
    void onMsg2(int a,int b);

};
#endif // JSCONTEXT_H

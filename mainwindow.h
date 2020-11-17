#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include "jscontext.h"
#include "webengineview.h"

#include <QMainWindow>
#include <QWebChannel>

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private:
    Ui::MainWindow *ui;
    JsContext *m_jsContext;
    QWebChannel*m_webChannel;
    WebEngineView*webView;
};

#endif // MAINWINDOW_H

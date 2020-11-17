#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    m_jsContext = new JsContext(this);
    m_webChannel = new QWebChannel(this);
    m_webChannel->registerObject("context", m_jsContext);

    webView =new WebEngineView(m_jsContext,this);
    ui->gridLayout_2->addWidget(webView);



    webView->page()->setWebChannel(m_webChannel);
    connect(m_jsContext, &JsContext::recvdMsg, this, [this](const QString& msg) {
        ui->statusBar->showMessage(QString("Received message：%1").arg(msg), 3000);
    });

    connect(ui->btnSend, &QPushButton::clicked, this, [this]() {
        QString msg = ui->msgEdit->text();
        if (!msg.isEmpty())
        {
            m_jsContext->sendMsg(webView->page(), msg);
        }
    });


    connect(ui->pushButton,&QPushButton::clicked,[=](){
        QString url = ui->lineEdit->text();
        if(!url.isEmpty())
            webView->load(url);
    });
    connect(ui->pushButton_2,&QPushButton::clicked,[=](){
        webView->reload();
    });
}

MainWindow::~MainWindow()
{
    delete ui;
}

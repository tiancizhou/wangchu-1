export function ConsultPage() {
  return (
    <main className="gray-page consult-page">
      <div className="container"><h1 className="form-heading">填写需求信息，免费获取产品设计方案</h1></div>
      <div className="container consult-card">
        <aside><h3>还有更多疑问?</h3><p>在线资讯或者直接拨打电话</p><div className="avatar">工程师</div><b>总工程师/王作富</b><p>这里是学历简介和工作经验</p><button>在线资讯</button><div className="consult-phone">资讯热线<br /><strong>0519-68288220</strong></div></aside>
        <section>
          <div className="steps"><span>01填写需求</span><span>02电话对接</span><span>03方案定制</span></div>
          <p>我们将尽快与您取得联系（严格保护您的信息不会泄露，请放心填写）</p>
          <form className="demand-form"><label>您的姓名：<input placeholder="请填写您的称呼" /></label><label>手机号码：<input placeholder="请填写您的联系方式" /></label><label>所处行业：<select><option>请选择您的行业</option></select></label><label>补充说明：<textarea /></label><button type="button">提交方案需求</button></form>
        </section>
      </div>
    </main>
  );
}

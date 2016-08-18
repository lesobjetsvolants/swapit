function setcookie()
{
  localStorage.setItem('lang',localtext.lang);
  localStorage.setItem('siteswap',document.getElementById('inputsiteswap')
              .value);
}

function getcookie()
{
  document.getElementById('inputsiteswap')
          .innerHTML=localStorage.getItem('siteswap');
	localtext.change_lang(localStorage.getItem('lang'));
}
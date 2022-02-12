export const fileIndexhtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="/applize?entry=true" defer></script>
    <title>Document</title>
    <style>
      nav {
        margin: 0;
        box-shadow: 0 0 5px rgb(0 0 0 / 30%);
        position: relative;
        height: 4em;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 1em;
      }
      nav p {
        display: inline;
        margin: 0;
        font-size: 120%;
      }
      nav .progress {
        width: 0%;
        background-color: hsl(216, 100%, 56%);
        position: absolute;
        bottom: -3px;
        left: 0;
        height: 3px;
        transition: width .2s cubic-bezier(0, 0.5, 0.6, 1), opacity .2s ease-out;
      }
      body {
        margin: 0;
      }
      #applize_content {
        padding: 1em;
      }
    </style>
</head>
<body>
  <nav>
    <p>Sample Application</p>
    <div class="progress" id="applize_spa_progress"></div>
  </nav>
  <section id="applize_content">

  </section>
</body>
</html>

`;

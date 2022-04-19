const primary = '#43BFB5'

const dark = {
  commercial: {
    fontColor: '#F2F3F7',
    components: {
      itemModal: {
        backgroundColor: '#222E3E',
        border: '#364353',
        fontColor: '#B5B8C2',
        iconColor: '#FFFFFF',
        inputFontColor: '#F2F3F7',
        titleColor: '#F2F3F7',
        disabledBackground: '#364353 ',
        replyIconColor: '#43BFB5',
        redAsterisk: '#FF7373'
      },
      costTable: {
        backgroundColor: '#151D28',
        title: '#F2F3F7',
        subtitle: '#B5B8C2',
        emptyLabel: '#B5B8C2'
      }
    },
    pages: {
      home: {
        mainColor: '#151D28'
      },
      proposal: {
        tableHeader: '#B5B8C2',
        dropdownColor: '#B5B8C2',
        lineDivisorColor: '#364353',
        breadcrumbInitial: '#B5B8C2',
        breadcrumbEnd: '#F2F3F7',
        listTextSpan: '#B5B8C2',
        exportListSpan: '#43BFB5',
        dropdownBackgroundColor: '#222E3E',
        dropdownBorderColor: '#364353',
        dropdownFontColor: '#F2F3F7',
        dropdownIconColor: '#F2F3F7'
      },
      newProposal: {
        background: '#222E3E',
        title: '#F2F3F7',
        subtitle: '#B5B8C2',
        border: '#505F73',
        font: '#F2F3F7',
        placeholder: '#7B8A9E',
        steps: {
          stepFare: '#B5B8C2',
          messageColor: '#222222',
          stepsBoxShadow: 'rgba(0, 0, 0, 0.2)',
          chips: {
            background: '#364353',
            color: '#B5B8C2',
            deleteBackground: '#B5B8C2'
          }
        }
      }
    }
  }
}

const light = {
  commercial: {
    fontColor: '#222222',
    components: {
      itemModal: {
        backgroundColor: '#FFFFFF',
        border: '#E3E5EB',
        fontColor: '#545454',
        iconColor: '#222222',
        inputFontColor: '#222222',
        titleColor: '#222222',
        disabledBackground: '#D9DCE6',
        replyIconColor: '#1F6660',
        redAsterisk: '#FF4D4D'
      },
      costTable: {
        backgroundColor: '#f0f1f5',
        title: '#222222',
        subtitle: '#545454',
        emptyLabel: '#999DAC'
      }
    },
    pages: {
      home: {
        mainColor: '#F2F3F7'
      },
      proposal: {
        tableHeader: '#545454',
        dropdownColor: '#222222',
        lineDivisorColor: '#e3e5eb',
        breadcrumbInitial: '#545454',
        breadcrumbEnd: '#222222',
        listTextSpan: '#545454',
        exportListSpan: '#1F6660',
        dropdownBackgroundColor: '#FFFFFF',
        dropdownBorderColor: '#D9DCE6',
        dropdownFontColor: '#222222',
        dropdownIconColor: '#545454'
      },
      newProposal: {
        background: '#FFFFFF',
        title: '#000000',
        subtitle: '#545454',
        border: '#F0F1F5',
        font: '#222222',
        placeholder: '#999DAC',
        steps: {
          stepFare: '#545454',
          messageColor: '#222222',
          stepsBoxShadow: 'rgba(0, 0, 0, 0.05)',
          chips: {
            background: '#C2C5D1',
            color: '#222222',
            deleteBackground: '#FFFFFF'
          }
        }
      }
    }
  }
}

export { light, dark, primary }
